import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Filter, Plus, Loader2, Trash2 } from "lucide-react"
import { getPeptides, deletePeptide, type Peptide } from "@/api/peptides"
import { useToast } from "@/hooks/useToast"
import { PeptideCreateForm } from "@/components/PeptideCreateForm"
import { useAuth } from "@/contexts/AuthContext"

const CATEGORIES = [
  "All Categories",
  "Healing & Recovery",
  "Growth Hormone",
  "Performance & Enhancement",
  "Anti-Aging",
  "Cognitive Enhancement"
]

const SORT_OPTIONS = [
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "experiences", label: "Most Experiences" },
  { value: "name", label: "Alphabetical" }
]

export function Peptides() {
  console.log("Peptides component: Starting render")
  
  const { isAuthenticated } = useAuth()
  const [peptides, setPeptides] = useState<Peptide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingPeptideId, setDeletingPeptideId] = useState<string | null>(null)
  const { toast } = useToast()

  console.log("Peptides component: State initialized", {
    showCreateForm,
    peptidesCount: peptides.length,
    loading,
    error
  })

  const fetchPeptides = async () => {
    console.log("Peptides component: Starting to fetch peptides")
    try {
      setLoading(true)
      setError(null)
      const response = await getPeptides()
      console.log("Peptides component: API response:", response)
      
      if (response.success && response.data?.peptides) {
        console.log("Peptides component: Setting peptides:", response.data.peptides)
        setPeptides(response.data.peptides)
      } else {
        console.log("Peptides component: Invalid response structure:", response)
        setError("Invalid response from server")
      }
    } catch (err: any) {
      console.error("Peptides component: Error fetching peptides:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load peptides",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      console.log("Peptides component: Finished fetching peptides")
    }
  }

  useEffect(() => {
    console.log("Peptides component: useEffect triggered")
    fetchPeptides()
  }, [])

  const handleCreateSuccess = () => {
    console.log("Peptides component: Create success callback triggered")
    setShowCreateForm(false)
    fetchPeptides() // Refresh the list
    toast({
      title: "Success",
      description: "Peptide created successfully"
    })
  }

  const handleCreateCancel = () => {
    console.log("Peptides component: Create cancel callback triggered")
    setShowCreateForm(false)
  }

  const handleDeletePeptide = async (peptideId: string, peptideName: string) => {
    console.log("Peptides component: Delete initiated for peptide:", peptideId, peptideName)
    try {
      setDeletingPeptideId(peptideId)
      await deletePeptide(peptideId)
      
      // Remove the peptide from the local state
      setPeptides(prevPeptides => prevPeptides.filter(p => p._id !== peptideId))
      
      toast({
        title: "Success",
        description: `${peptideName} has been deleted successfully`
      })
      
      console.log("Peptides component: Peptide deleted successfully:", peptideId)
    } catch (error: any) {
      console.error("Peptides component: Error deleting peptide:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setDeletingPeptideId(null)
    }
  }

  // Filter and sort peptides
  const filteredPeptides = peptides
    .filter(peptide => {
      const matchesSearch = peptide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           peptide.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || peptide.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.averageRating - a.averageRating
        case "experiences":
          return b.totalExperiences - a.totalExperiences
        case "popularity":
          return b.popularity - a.popularity
        default:
          return 0
      }
    })

  console.log("Peptides component: About to render, showCreateForm:", showCreateForm)

  if (showCreateForm) {
    console.log("Peptides component: Rendering create form")
    return (
      <PeptideCreateForm
        onSuccess={handleCreateSuccess}
        onCancel={handleCreateCancel}
      />
    )
  }

  console.log("Peptides component: Rendering main peptides view")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Peptides</h1>
          <p className="text-muted-foreground mt-2">
            Explore our comprehensive database of peptides
          </p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => {
            console.log("Peptides component: Create button clicked")
            setShowCreateForm(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Peptide
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Tabs defaultValue="grid" className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-4 flex-1 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search peptides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Healing & Recovery">Healing & Recovery</SelectItem>
                <SelectItem value="Growth Hormone">Growth Hormone</SelectItem>
                <SelectItem value="Performance & Enhancement">Performance & Enhancement</SelectItem>
                <SelectItem value="Anti-Aging">Anti-Aging</SelectItem>
                <SelectItem value="Cognitive Enhancement">Cognitive Enhancement</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="experiences">Experiences</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="grid" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading peptides...</span>
            </div>
          ) : filteredPeptides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No peptides found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeptides.map((peptide) => (
                <Card key={peptide._id} className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Link to={`/peptides/${peptide._id}`} className="flex-1">
                        <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                          {peptide.name}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {peptide.category}
                        </Badge>
                      </Link>
                      {isAuthenticated && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={deletingPeptideId === peptide._id}
                            >
                              {deletingPeptideId === peptide._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Peptide</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{peptide.name}"? This action cannot be undone and will remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePeptide(peptide._id, peptide.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    <Link to={`/peptides/${peptide._id}`}>
                      <CardDescription className="line-clamp-2">
                        {peptide.description}
                      </CardDescription>
                    </Link>
                  </CardHeader>
                  <Link to={`/peptides/${peptide._id}`}>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="font-medium">{peptide.averageRating.toFixed(1)}/10</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Experiences:</span>
                          <span className="font-medium">{peptide.totalExperiences}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dosage:</span>
                          <span className="font-medium">{peptide.commonDosage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Frequency:</span>
                          <span className="font-medium">{peptide.commonFrequency}</span>
                        </div>
                      </div>

                      {peptide.commonEffects && peptide.commonEffects.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Common Effects:</p>
                          <div className="flex flex-wrap gap-1">
                            {peptide.commonEffects.slice(0, 3).map((effect, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                            {peptide.commonEffects.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{peptide.commonEffects.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading peptides...</span>
            </div>
          ) : filteredPeptides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No peptides found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPeptides.map((peptide) => (
                <Card key={peptide._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <Link to={`/peptides/${peptide._id}`} className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                            {peptide.name}
                          </h3>
                          <Badge variant="secondary">{peptide.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {peptide.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Rating: </span>
                            <span className="font-medium">{peptide.averageRating.toFixed(1)}/10</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Experiences: </span>
                            <span className="font-medium">{peptide.totalExperiences}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Dosage: </span>
                            <span className="font-medium">{peptide.commonDosage}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frequency: </span>
                            <span className="font-medium">{peptide.commonFrequency}</span>
                          </div>
                        </div>

                        {peptide.commonEffects && peptide.commonEffects.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Common Effects:</p>
                            <div className="flex flex-wrap gap-1">
                              {peptide.commonEffects.slice(0, 5).map((effect, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {effect}
                                </Badge>
                              ))}
                              {peptide.commonEffects.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{peptide.commonEffects.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </Link>
                      
                      {isAuthenticated && (
                        <div className="ml-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deletingPeptideId === peptide._id}
                              >
                                {deletingPeptideId === peptide._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Peptide</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{peptide.name}"? This action cannot be undone and will remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePeptide(peptide._id, peptide.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}