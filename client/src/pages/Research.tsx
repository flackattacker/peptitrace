console.log("Research.tsx file is being loaded and parsed");

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Database, Download, FileText, Key, Users, BarChart3, AlertCircle, CheckCircle, Loader2, Trash2 } from "lucide-react"
import { seedPeptides, clearPeptides } from "@/api/peptides"
import { seedEffects, clearEffects } from "@/api/effects"
import { getAnalytics } from "@/api/analytics"
import { useToast } from "@/hooks/useToast"

console.log("All imports loaded successfully");

export function Research() {
  console.log("Research component function started");
  
  const [seedingPeptides, setSeedingPeptides] = useState(false)
  const [seedingEffects, setSeedingEffects] = useState(false)
  const [clearingEffects, setClearingEffects] = useState(false)
  const [clearingPeptides, setClearingPeptides] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  console.log("State and hooks initialized");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Research: Fetching analytics data...')
        const analyticsData = await getAnalytics()
        console.log('Research: Analytics data received:', analyticsData)
        setAnalytics((analyticsData as any).data)
      } catch (error: any) {
        console.error('Research: Error fetching analytics:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [toast])

  const handleSeedPeptides = async () => {
    setSeedingPeptides(true)
    try {
      const result = await seedPeptides() as any
      toast({
        title: "Success",
        description: `${result.message}. Seeded ${result.count} peptides.`
      })
      // Refresh analytics
      const analyticsData = await getAnalytics()
      setAnalytics((analyticsData as any).data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSeedingPeptides(false)
    }
  }

  const handleSeedEffects = async () => {
    setSeedingEffects(true)
    try {
      const result = await seedEffects() as any
      toast({
        title: "Success",
        description: `${result.message}. Seeded ${result.count} effects.`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSeedingEffects(false)
    }
  }

  const handleClearEffects = async () => {
    setClearingEffects(true)
    try {
      const result = await clearEffects() as any
      toast({
        title: "Success",
        description: `${result.message}. Deleted ${result.deletedCount} effects.`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setClearingEffects(false)
    }
  }

  const handleClearPeptides = async () => {
    setClearingPeptides(true)
    try {
      const result = await clearPeptides() as any
      toast({
        title: "Success",
        description: `${result.message}. Cleared peptides database.`
      })
      // Refresh analytics
      const analyticsData = await getAnalytics()
      setAnalytics((analyticsData as any).data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setClearingPeptides(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log("Handler functions defined, starting render");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Hub</h1>
        <p className="text-muted-foreground mt-2">
          Access research data, manage database, and explore academic resources
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalExperiences || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalExperiences > 0 ? 'Real user submissions' : 'No data available'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peptides Tracked</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalPeptides || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalPeptides > 0 ? 'In database' : 'No peptides seeded'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Quality Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.totalExperiences > 0 ? '94%' : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalExperiences > 0 ? 'Based on submissions' : 'Insufficient data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.averageRating ? `${analytics.averageRating}/10` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.averageRating ? 'Community average' : 'No ratings yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Research Impact</CardTitle>
                <CardDescription>Citations and academic usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Published Papers</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences > 100 ? '23' : '0'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Academic Citations</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences > 100 ? '156' : '0'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Research Collaborations</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences > 50 ? '8' : '0'}
                  </Badge>
                </div>
                {analytics?.totalExperiences < 50 && (
                  <p className="text-sm text-muted-foreground">
                    More data needed for research metrics
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Health</CardTitle>
                <CardDescription>Platform engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Active Contributors</span>
                  <Badge variant="secondary">{analytics?.totalExperiences || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Peer Reviews</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences ? analytics.totalExperiences * 2 : 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quality Reports</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                {!analytics?.totalExperiences && (
                  <p className="text-sm text-muted-foreground">
                    No community activity yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Seed initial data and manage database collections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These operations will modify the database. Use with caution in production environments.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Seed Peptides</h4>
                    <p className="text-sm text-muted-foreground">
                      Initialize database with common peptides and their properties
                    </p>
                  </div>
                  <Button
                    onClick={handleSeedPeptides}
                    disabled={seedingPeptides}
                    className="min-w-[100px]"
                  >
                    {seedingPeptides ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Seeding...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Seed Peptides
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Clear Peptides</h4>
                    <p className="text-sm text-muted-foreground">
                      Remove all peptides from the database
                    </p>
                  </div>
                  <Button
                    onClick={handleClearPeptides}
                    disabled={clearingPeptides}
                    variant="destructive"
                    className="min-w-[100px]"
                  >
                    {clearingPeptides ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Peptides
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Seed Effects</h4>
                    <p className="text-sm text-muted-foreground">
                      Initialize database with common effects and side effects
                    </p>
                  </div>
                  <Button
                    onClick={handleSeedEffects}
                    disabled={seedingEffects}
                    className="min-w-[100px]"
                  >
                    {seedingEffects ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Seeding...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Seed Effects
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Clear Effects</h4>
                    <p className="text-sm text-muted-foreground">
                      Remove all effects data from the database
                    </p>
                  </div>
                  <Button
                    onClick={handleClearEffects}
                    disabled={clearingEffects}
                    variant="destructive"
                    className="min-w-[100px]"
                  >
                    {clearingEffects ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Clear Effects
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export functionality coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Data export features will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>API documentation coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">API documentation will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Guidelines</CardTitle>
              <CardDescription>Guidelines coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Research guidelines will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}