import React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart, PieChart, TrendingUp, Users, Filter, Download, Calendar } from "lucide-react"
import { getAnalytics, comparePeptides, getPeptideTrends, type AnalyticsData, type PeptideTrends } from "@/api/analytics"
import { getPeptides, type Peptide } from "@/api/peptides"
import { useToast } from "@/hooks/useToast"

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Explore ErrorBoundary caught error:', error);
    console.error('Explore ErrorBoundary error info:', errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

export function Explore() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [peptides, setPeptides] = useState<Peptide[]>([])
  const [trends, setTrends] = useState<PeptideTrends | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeptides, setSelectedPeptides] = useState<string[]>([])
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [trendsPeriod, setTrendsPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Explore: useEffect fetchData started');
        console.log('Explore: About to make API calls');

        const [analyticsResult, peptidesResult, trendsResult] = await Promise.all([
          getAnalytics(),
          getPeptides(),
          getPeptideTrends('monthly', 12)
        ]);

        console.log('Explore: All API calls completed');
        console.log('Explore: analyticsResult:', analyticsResult);
        console.log('Explore: peptidesResult:', peptidesResult);
        console.log('Explore: trendsResult:', trendsResult);

        // Handle analytics data
        if (analyticsResult?.data) {
          console.log('Explore: Setting analytics data:', analyticsResult.data);
          setAnalytics(analyticsResult.data);
        }

        // Handle peptides data
        let finalPeptides: Peptide[] = [];
        if (peptidesResult?.data?.peptides) {
          finalPeptides = peptidesResult.data.peptides;
        } else if (peptidesResult?.peptides) {
          finalPeptides = peptidesResult.peptides;
        } else if (Array.isArray(peptidesResult)) {
          finalPeptides = peptidesResult;
        }
        console.log('Explore: Setting peptides data:', finalPeptides);
        setPeptides(finalPeptides);

        // Handle trends data
        if (trendsResult?.data) {
          console.log('Explore: Setting trends data:', trendsResult.data);
          setTrends(trendsResult.data);
        }

        console.log('Explore: All state updates completed');

      } catch (error: any) {
        console.error('Explore: Error in fetchData:', error);
        console.error('Explore: Error stack:', error.stack);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        console.log('Explore: Setting loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, [toast])

  const handleCompare = async () => {
    if (selectedPeptides.length < 2) {
      toast({
        title: "Select Peptides",
        description: "Please select at least 2 peptides to compare",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await comparePeptides(selectedPeptides)
      setComparisonData(result.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleTrendsPeriodChange = async (newPeriod: 'daily' | 'weekly' | 'monthly') => {
    try {
      setTrendsPeriod(newPeriod)
      const trendsResult = await getPeptideTrends(newPeriod, 12)
      if (trendsResult?.data) {
        setTrends(trendsResult.data)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Data Explorer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore aggregated peptide experiences and discover insights from the community
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {analytics?.totalExperiences?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Experiences</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardContent className="p-6 text-center">
              <BarChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {analytics?.totalPeptides || 0}
              </div>
              <div className="text-sm text-muted-foreground">Peptides Tracked</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {analytics?.averageRating?.toFixed(1) || 0}/5
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <CardContent className="p-6 text-center">
              <LineChart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {analytics?.activeUsers || analytics?.totalExperiences || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="peptides">Top Peptides</TabsTrigger>
            <TabsTrigger value="trends">Usage Trends</TabsTrigger>
            <TabsTrigger value="growth">Growth Trends</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Peptides Chart */}
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
                <CardHeader>
                  <CardTitle>Most Popular Peptides</CardTitle>
                  <CardDescription>Based on number of experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topPeptides && Array.isArray(analytics.topPeptides) ? (
                      analytics.topPeptides.map((peptide, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{peptide.name}</div>
                              <div className="text-sm text-muted-foreground">★ {peptide.rating.toFixed(1)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{peptide.experiences}</div>
                            <div className="text-sm text-muted-foreground">experiences</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No top peptides data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Effectiveness Distribution */}
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
                <CardHeader>
                  <CardTitle>Effectiveness Ratings</CardTitle>
                  <CardDescription>Average effectiveness by peptide</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.effectivenessData && Array.isArray(analytics.effectivenessData) ? (
                      analytics.effectivenessData.map((item) => {
                        const effectivenessValues = Object.values(item.effectiveness);
                        const averageEffectiveness = effectivenessValues.reduce((a, b) => a + b, 0) / effectivenessValues.length;
                        return (
                          <div key={item.peptide} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.peptide}</span>
                              <span>{averageEffectiveness.toFixed(1)}/5 ({item.experiences} experiences)</span>
                            </div>
                            <Progress value={(averageEffectiveness / 5) * 100} className="h-2" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No effectiveness data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle>Peptide Comparison Tool</CardTitle>
                <CardDescription>Compare up to 3 peptides side by side</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                      <Label>Peptide {index + 1}</Label>
                      <Select
                        value={selectedPeptides[index] || ""}
                        onValueChange={(value) => {
                          const newSelected = [...selectedPeptides]
                          newSelected[index] = value
                          setSelectedPeptides(newSelected.filter(Boolean))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select peptide" />
                        </SelectTrigger>
                        <SelectContent>
                          {peptides && Array.isArray(peptides) && peptides.length > 0 ? (
                            peptides.map(peptide => (
                              <SelectItem key={String(peptide._id)} value={String(peptide._id)}>
                                {peptide.name}
                              </SelectItem>
                            ))
                          ) : null}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <Button onClick={handleCompare} className="w-full">
                  Compare Selected Peptides
                </Button>

                {comparisonData && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Comparison Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {comparisonData.map((peptide: any) => (
                        <Card key={peptide._id}>
                          <CardHeader>
                            <CardTitle>{peptide.name}</CardTitle>
                            <CardDescription>{peptide.category}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Total Experiences</span>
                                <span>{peptide.totalExperiences}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Average Rating</span>
                                <span>{peptide.averageRating.toFixed(1)}/5</span>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm font-medium">Outcomes</div>
                                {Object.entries(peptide.outcomes).map(([key, value]: [string, any]) => (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="capitalize">{key}</span>
                                    <span>{value.toFixed(1)}/5</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}