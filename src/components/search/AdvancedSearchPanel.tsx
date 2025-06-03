
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, TrendingUp, Calendar, Heart, Zap } from 'lucide-react';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';

const AdvancedSearchPanel = () => {
  const { results, loading, filters, updateFilters, availableCategories, availableTags } = useAdvancedSearch();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const clearFilters = () => {
    updateFilters({
      query: '',
      category: 'all',
      tags: [],
      sortBy: 'trending',
      timeRange: 'all',
      minLikes: 0,
      featuredOnly: false
    });
  };

  const getSortIcon = (sortType: string) => {
    switch (sortType) {
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'newest': return <Calendar className="h-4 w-4" />;
      case 'popular': return <Heart className="h-4 w-4" />;
      case 'viral': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Advanced Search
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fails, titles, descriptions..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Quick Sort Options */}
          <div className="flex flex-wrap gap-2">
            {(['trending', 'newest', 'popular', 'viral'] as const).map((sort) => (
              <Button
                key={sort}
                variant={filters.sortBy === sort ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ sortBy: sort })}
                className="flex items-center gap-2"
              >
                {getSortIcon(sort)}
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Range */}
                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Select value={filters.timeRange} onValueChange={(value) => updateFilters({ timeRange: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Only */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={filters.featuredOnly}
                      onCheckedChange={(checked) => updateFilters({ featuredOnly: checked })}
                    />
                    Featured Only
                  </Label>
                </div>
              </div>

              {/* Minimum Likes Slider */}
              <div className="space-y-2">
                <Label>Minimum Likes: {filters.minLikes}</Label>
                <Slider
                  value={[filters.minLikes]}
                  onValueChange={([value]) => updateFilters({ minLikes: value })}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {filters.tags.includes(tag) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Active Filters Summary */}
          {(filters.query || filters.category !== 'all' || filters.tags.length > 0 || filters.featuredOnly) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.query && (
                <Badge variant="secondary">
                  Search: "{filters.query}"
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilters({ query: '' })} />
                </Badge>
              )}
              {filters.category !== 'all' && (
                <Badge variant="secondary">
                  Category: {filters.category}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilters({ category: 'all' })} />
                </Badge>
              )}
              {filters.featuredOnly && (
                <Badge variant="secondary">
                  Featured Only
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilters({ featuredOnly: false })} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Search Results {!loading && `(${results.length})`}
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <Card key={result.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                {result.image_url && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={result.image_url}
                      alt={result.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {result.is_featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-semibold line-clamp-2">{result.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {result.profiles?.username || 'Anonymous'}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {result.likes}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or clearing some filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchPanel;
