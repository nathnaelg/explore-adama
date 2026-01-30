
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Place, PlaceCategory } from '../types';
import { api } from '../services/api';
import { 
  MapPin, Plus, Star, Map as MapIcon, 
  List, Pencil, Trash2, Info, 
  Crosshair, X, LayoutGrid,
  Eye, Calendar, Hash, Ticket, Loader2, Image as ImageIcon,
  Locate, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, AlertCircle, CheckCircle
} from 'lucide-react';
import { cn } from '../utils';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';


declare global {
  interface Window {
    L: any;
  }
}

interface PlacesMapProps {
  isDarkMode: boolean;
  searchTerm?: string;
}

const PlacesMap: React.FC<PlacesMapProps> = ({ isDarkMode, searchTerm = '' }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'delete', message: string } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [hasMore, setHasMore] = useState(false);
  const [totalPlaces, setTotalPlaces] = useState(0);

  const effectiveSearch = searchTerm;
  
  const [dateFilter, setDateFilter] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating' | 'reviews'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const showFeedback = (type: 'success' | 'error' | 'delete', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    if (value === 'all') {
        setDateFilter('');
    } else if (value === 'today') {
        setDateFilter(`${year}-${month}-${day}`);
    } else if (value === 'month') {
        setDateFilter(`${year}-${month}`);
    } else if (value === 'year') {
        setDateFilter(`${year}`);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [placeToDelete, setPlaceToDelete] = useState<Place | null>(null);
  const [placeToView, setPlaceToView] = useState<Place | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  
  const [formData, setFormData] = useState<{
    name: string;
    categoryId: string;
    status: string;
    address: string;
    description: string;
    rating: number;
    image: string;
    coordinates: { lat: number; lng: number };
  }>({
    name: '',
    categoryId: '',
    status: 'OPEN',
    address: '',
    description: '',
    rating: 5,
    image: '',
    coordinates: { lat: 8.5410, lng: 39.2688 }
  });

  const fetchData = async () => {
      setIsLoading(true);
      try {
          const [placesRes, catsRes] = await Promise.all([
              api.get<{ data: any[] }>(`/places?page=${currentPage}&perPage=${itemsPerPage}&search=${effectiveSearch}`),
              api.get<{ data: any[] }>('/categories')
          ]).catch(err => {
              console.error("API Error", err);
              return [{ data: [] }, { data: [] }];
          });

          if (catsRes && Array.isArray(catsRes.data)) {
              setCategories(catsRes.data);
          } else if (Array.isArray(catsRes)) {
               setCategories(catsRes);
          }

          if (placesRes && Array.isArray(placesRes.data)) {
              const mappedPlaces = placesRes.data.map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  description: p.description,
                  category: (p.category?.name as PlaceCategory) || PlaceCategory.ATTRACTION,
                  categoryId: p.categoryId,
                  rating: p.avgRating || 0,
                  reviewsCount: p.reviews?.length || 0,
                  status: 'OPEN' as const,
                  image: p.images?.[0]?.url || p.image || '',
                  address: p.address,
                  coordinates: { lat: p.latitude, lng: p.longitude },
                  viewCount: p.viewCount || 0,
                  bookingCount: p.bookingCount || 0,
                  createdAt: p.createdAt,
                  updatedAt: p.updatedAt
              }));
              setPlaces(mappedPlaces);
              const serverTotal = (placesRes as any).total || (placesRes as any).count || 0;
              setTotalPlaces(serverTotal || mappedPlaces.length);
              setHasMore(serverTotal > 0 ? (currentPage * itemsPerPage < serverTotal) : mappedPlaces.length === itemsPerPage);
          }
      } catch (error) {
          console.error("Failed to load places data", error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, [currentPage, effectiveSearch]);

  const filteredPlaces = places.filter(place => {
    const dateMatch = dateFilter 
      ? (place.createdAt && place.createdAt.startsWith(dateFilter))
      : true;

    return dateMatch;
  }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'rating') {
          comparison = (a.rating || 0) - (b.rating || 0);
      } else if (sortBy === 'reviews') {
          comparison = (a.reviewsCount || 0) - (b.reviewsCount || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleOpenAdd = (coords?: { lat: number, lng: number }) => {
    setEditingId(null);
    setFileToUpload(null);
    setPreviewImage('');
    setFormData({
      name: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      status: 'OPEN',
      address: '',
      description: '',
      rating: 5,
      image: '',
      coordinates: coords || { lat: 8.5410, lng: 39.2688 }
    });
    setIsDialogOpen(true);
    setIsDetailOpen(false);
  };

  const handleOpenEdit = (place: Place, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingId(place.id);
    setFileToUpload(null);
    setPreviewImage(place.image || '');
    const catId = place.categoryId || categories.find(c => c.name === place.category)?.id || '';
    
    setFormData({
        name: place.name,
        categoryId: catId,
        status: place.status,
        address: place.address,
        description: place.description,
        rating: place.rating,
        image: place.image,
        coordinates: place.coordinates
    });
    setIsDialogOpen(true);
    setIsDetailOpen(false);
  };

  const handleOpenDelete = (place: Place, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPlaceToDelete(place);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (place: Place, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPlaceToView(place);
    setIsDetailOpen(true);
    setIsDialogOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setFileToUpload(file);
          setPreviewImage(URL.createObjectURL(file));
      }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
        let currentId = editingId;
        let finalImageUrl = formData.image;

        if (!currentId) {
             const payload = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                latitude: formData.coordinates.lat,
                longitude: formData.coordinates.lng,
                address: formData.address,
                image: '' 
            };
            const res = await api.post<{ id: string }>('/places', payload);
            currentId = res.id;
        }

        if (fileToUpload && currentId) {
            const uploadData = new FormData();
            uploadData.append('file', fileToUpload);
            uploadData.append('caption', formData.name);

            const uploadRes = await api.post<{ url: string }>(`/places/${currentId}/images`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            finalImageUrl = uploadRes.url;
        }

        if (currentId) {
            const payload = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                latitude: formData.coordinates.lat,
                longitude: formData.coordinates.lng,
                address: formData.address,
                image: finalImageUrl
            };
            await api.put(`/places/${currentId}`, payload);
        }

        await fetchData(); 
        setIsDialogOpen(false);
        showFeedback('success', "Location data synchronized successfully.");

    } catch (error: any) {
        console.error("Failed to save place", error);
        showFeedback('error', error.response?.data?.message || "Failed to save place details.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (placeToDelete) {
      try {
          await api.delete(`/places/${placeToDelete.id}`);
          setPlaces(places.filter(p => p.id !== placeToDelete.id));
          
          if (markersRef.current[placeToDelete.id]) {
            markersRef.current[placeToDelete.id].remove();
            delete markersRef.current[placeToDelete.id];
          }
          showFeedback('delete', "Place removed successfully.");
      } catch (error) {
          console.error("Failed to delete place", error);
          showFeedback('error', "Deletion failed.");
      }
      
      setIsDeleteDialogOpen(false);
      setPlaceToDelete(null);
      if (selectedPlaceId === placeToDelete?.id) {
        setSelectedPlaceId(null);
      }
    }
  };

  const updateCoordinates = (lat: number, lng: number) => {
     setFormData(prev => ({
         ...prev,
         coordinates: { lat, lng }
     }));
  };

  const getCurrentLocation = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
              updateCoordinates(position.coords.latitude, position.coords.longitude);
          });
      }
  };

  const handleOpenAddRef = useRef(handleOpenAdd);
  useEffect(() => {
    handleOpenAddRef.current = handleOpenAdd;
  }, [handleOpenAdd]);

  useEffect(() => {
    if (activeTab === 'map' && mapContainerRef.current && !mapRef.current && window.L) {
      const map = window.L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false
      }).setView([8.5410, 39.2688], 13);

      const tileLayerUrl = isDarkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      window.L.tileLayer(tileLayerUrl, { maxZoom: 19 }).addTo(map);
      
      map.on('click', (e: any) => {
          handleOpenAddRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
    }
  }, [activeTab]);

  useEffect(() => {
      if (activeTab === 'map' && mapRef.current && window.L) {
          mapRef.current.eachLayer((layer: any) => {
              if (layer instanceof window.L.TileLayer) {
                  const url = isDarkMode 
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
                  if (layer._url !== url) {
                      layer.setUrl(url);
                  }
              }
          });

          Object.values(markersRef.current).forEach((marker: any) => marker.remove());
          markersRef.current = {};

          filteredPlaces.forEach(place => {
              const customIcon = window.L.divIcon({
                  className: 'bg-transparent border-0',
                  html: `<div class="relative w-10 h-10 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white ${getCategoryColorClass(place.category)} transition-transform hover:scale-110">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                         </div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 40]
              });

              const marker = window.L.marker([place.coordinates.lat, place.coordinates.lng], { icon: customIcon })
                .addTo(mapRef.current)
                .bindPopup(`
                    <div class="text-center">
                        <strong class="text-sm block mb-1">${place.name}</strong>
                        <span class="text-xs uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">${place.category}</span>
                    </div>
                `);
              
              markersRef.current[place.id] = marker;
          });
          
          setTimeout(() => mapRef.current.invalidateSize(), 100);
      }
  }, [activeTab, isDarkMode, filteredPlaces]);


  const getCategoryColorClass = (category: string) => {
     const cat = category?.toLowerCase() || '';
     if (cat.includes('hotel') || cat.includes('stay') || cat.includes('resort')) return 'bg-blue-500';
     if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe') || cat.includes('bar')) return 'bg-orange-500';
     if (cat.includes('park') || cat.includes('nature') || cat.includes('garden')) return 'bg-green-500';
     if (cat.includes('museum') || cat.includes('history') || cat.includes('culture') || cat.includes('art')) return 'bg-pink-500';
     if (cat.includes('shop') || cat.includes('mall') || cat.includes('market')) return 'bg-yellow-500';
     if (cat.includes('transport') || cat.includes('station') || cat.includes('airport')) return 'bg-slate-600';
     if (cat.includes('health') || cat.includes('hospital') || cat.includes('clinic')) return 'bg-red-500';
     if (cat.includes('event') || cat.includes('hall') || cat.includes('cinema')) return 'bg-purple-500';
     if (cat.includes('sport') || cat.includes('gym') || cat.includes('stadium')) return 'bg-emerald-600';
     return 'bg-indigo-500';
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         
         <div className="bg-white dark:bg-zinc-900 p-1 rounded-xl flex gap-1 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <button
              onClick={() => setActiveTab('list')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all",
                activeTab === 'list' 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              <LayoutGrid size={16} /> Directory
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all",
                activeTab === 'map' 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              <MapIcon size={16} /> Map View
            </button>
         </div>

         <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
             <Select 
                value={timeRange} 
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="w-full md:w-[130px]"
              >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
              </Select>
             
             {activeTab === 'list' && (
                 <div className="flex items-center gap-2">
                    <Select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-[120px]"
                    >
                        <option value="date">Date Added</option>
                        <option value="name">Name</option>
                        <option value="rating">Rating</option>
                        <option value="reviews">Reviews</option>
                    </Select>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        title={sortOrder === 'asc' ? "Ascending" : "Descending"}
                    >
                        {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </Button>
                 </div>
             )}

             <Input 
                type="search"
                placeholder="Date (YYYY-MM-DD)"
                value={dateFilter} 
                onChange={(e) => {
                    setDateFilter(e.target.value);
                    if(e.target.value === '') setTimeRange('all');
                }}
                className="w-full md:w-auto"
             />
             <Button onClick={() => handleOpenAdd()} className="gap-2 shrink-0 w-full md:w-auto">
                 <Plus size={18} /> New Place
             </Button>
         </div>
      </div>

      {isLoading ? (
           <div className="flex flex-col items-center justify-center h-[600px] space-y-4" data-testid="loader">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    </div>
      ) : activeTab === 'list' ? (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No places found.</p>
                    </div>
                ) : filteredPlaces.map(place => (
                    <Card key={place.id} className="h-[500px] group flex flex-col overflow-hidden border-gray-100 dark:border-zinc-800 hover:border-blue-500/50 transition-all duration-300">
                        <div className="relative h-1/2 overflow-hidden bg-gray-200 dark:bg-zinc-800">
                            {place.image ? (
                                <img 
                                    src={place.image} 
                                    alt={place.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <MapPin size={32} />
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className={cn(
                                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md shadow-sm",
                                    place.status === 'OPEN' ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                                )}>
                                    {place.status}
                                </span>
                            </div>
                            <div className="absolute bottom-3 left-3">
                                <span className={cn(
                                    "text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md uppercase tracking-wider border border-white/20",
                                    getCategoryColorClass(place.category)
                                )}>
                                    {place.category}
                                </span>
                            </div>
                        </div>

                        <CardContent className="flex flex-col flex-1 p-5">
                            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-zinc-400">
                                <span className="flex items-center gap-1 truncate"><MapPin size={12} /> {place.address}</span>
                            </div>
                            
                            <h3 className="text-lg font-bold mb-2 line-clamp-1 leading-tight group-hover:text-blue-500 transition-colors">
                                {place.name}
                            </h3>
                            
                            <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                                {place.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 mt-auto">
                                <div className="flex gap-3 text-xs font-medium text-gray-400">
                                    <span className="flex items-center gap-1 text-yellow-500">
                                        <Star size={14} className="fill-yellow-500" /> {place.rating || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        ({place.reviewsCount})
                                    </span>
                                </div>
                                
                                <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                                        onClick={(e) => handleViewDetails(place, e)}
                                        title="View Details"
                                    >
                                        <Info size={16} />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500"
                                        onClick={(e) => handleOpenEdit(place, e)}
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                        onClick={(e) => handleOpenDelete(place, e)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {!isLoading && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
                >
                    <ChevronLeft size={16} /> Previous
                </Button>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Page {currentPage} of {Math.ceil(totalPlaces / itemsPerPage)}
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= Math.ceil(totalPlaces / itemsPerPage) || !hasMore || isLoading}
                    className="gap-2 rounded-xl text-[10px] uppercase font-black tracking-widest px-4"
                >
                    Next <ChevronRight size={16} />
                </Button>
            </div>
            )}
        </div>
      ) : (
        <div className="h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-inner relative bg-gray-100 dark:bg-zinc-900">
             <div ref={mapContainerRef} className="w-full h-full z-0" />
             <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                 <Button size="icon" className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 shadow-md hover:bg-gray-50" onClick={() => mapRef.current?.zoomIn()}>
                     <Plus size={20} />
                 </Button>
                 <Button size="icon" className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 shadow-md hover:bg-gray-50" onClick={() => mapRef.current?.zoomOut()}>
                     <span className="text-xl font-bold">-</span>
                 </Button>
                 <Button size="icon" className="bg-white dark:bg-zinc-800 text-blue-500 shadow-md hover:bg-gray-50" onClick={getCurrentLocation}>
                     <Locate size={20} />
                 </Button>
             </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" onClose={() => setIsDialogOpen(false)}>
              <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Place' : 'Add New Place'}</DialogTitle>
                  <DialogDescription>Details for the location marker.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave}>
                  <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>Name</Label>
                              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Haile Resort" />
                          </div>
                          <div className="space-y-2">
                              <Label>Category</Label>
                              <Select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                                  <option value="" disabled>Select Category</option>
                                  {categories.map((cat: any) => (
                                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                                  ))}
                              </Select>
                          </div>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center justify-between mb-3">
                              <Label className="text-blue-700 dark:text-blue-400 font-bold flex items-center gap-2">
                                  <MapPin size={16} /> Location Coordinates
                              </Label>
                              <Button 
                                type="button" 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs bg-white dark:bg-black"
                                onClick={getCurrentLocation}
                              >
                                  <Crosshair size={12} className="mr-1" /> Use Current Location
                              </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <Label className="text-xs text-gray-500">Latitude</Label>
                                  <Input 
                                    type="number" 
                                    step="any" 
                                    value={formData.coordinates?.lat} 
                                    onChange={e => updateCoordinates(parseFloat(e.target.value), formData.coordinates?.lng || 0)} 
                                    required 
                                    className="bg-white dark:bg-black h-9"
                                  />
                              </div>
                              <div className="space-y-1">
                                  <Label className="text-xs text-gray-500">Longitude</Label>
                                  <Input 
                                    type="number" 
                                    step="any" 
                                    value={formData.coordinates?.lng} 
                                    onChange={e => updateCoordinates(formData.coordinates?.lat || 0, parseFloat(e.target.value))} 
                                    required 
                                    className="bg-white dark:bg-black h-9"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <Label>Address</Label>
                          <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required placeholder="Street address or Area" />
                      </div>

                      <div className="space-y-2">
                          <Label>Cover Image</Label>
                          <div className="flex flex-col gap-3">
                              <label className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 w-full px-3">
                                 <ImageIcon size={18} className="mr-2" />
                                 {fileToUpload ? fileToUpload.name : (previewImage && editingId ? "Change Image" : "Upload Image")}
                                 <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                             </label>
                             {previewImage && (
                                <div className="h-32 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                             )}
                          </div>
                      </div>

                      <div className="space-y-2">
                          <Label>Description</Label>
                          <textarea 
                             className="w-full h-24 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950 resize-none"
                             value={formData.description}
                             onChange={e => setFormData({...formData, description: e.target.value})}
                             placeholder="Write a brief description about this place..."
                          ></textarea>
                      </div>
                  </div>
                  <DialogFooter>
                      <Button variant="secondary" type="button" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                      <Button type="submit" disabled={isSaving}>
                          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Location'}
                      </Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-0 [&>button]:hidden" onClose={() => setIsDetailOpen(false)}>
            {placeToView && (
                <div className="flex flex-col md:flex-row h-[85vh] md:h-[600px]">
                    <div className="relative w-full md:w-2/5 h-48 md:h-full shrink-0 bg-gray-200 dark:bg-zinc-800">
                        {placeToView.image ? (
                            <img src={placeToView.image} alt={placeToView.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <MapPin size={48} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                        
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                             <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md border border-white/10 w-fit",
                                placeToView.status === 'OPEN' ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                            )}>
                                {placeToView.status}
                            </span>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-white text-xs font-bold uppercase backdrop-blur-md border border-white/10 w-fit",
                                getCategoryColorClass(placeToView.category)
                            )}>
                                {placeToView.category}
                            </span>
                        </div>

                         <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white md:hidden">
                             <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Star size={16} className="fill-yellow-400 text-yellow-400" /> 
                                {placeToView.rating} ({placeToView.reviewsCount} reviews)
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 h-full overflow-hidden">
                        
                        <div className="p-6 pb-2 shrink-0 flex justify-between items-start">
                             <div>
                                <h2 className="text-2xl font-bold tracking-tight mb-1">{placeToView.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                                    <MapPin size={16} /> {placeToView.address}
                                </div>
                             </div>
                             <Button size="icon" variant="ghost" onClick={() => setIsDetailOpen(false)} className="rounded-full h-8 w-8 hover:bg-gray-100 dark:hover:bg-zinc-800 -mr-2 -mt-2">
                                <X size={20} />
                             </Button>
                        </div>

                        <div className="p-6 pt-2 overflow-y-auto flex-1">
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 opacity-80">About</h3>
                                <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">
                                    {placeToView.description}
                                </p>
                            </div>

                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 opacity-80">Details</h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                 <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Hash size={10}/> ID</div>
                                    <div className="font-mono text-xs truncate" title={placeToView.id}>{placeToView.id}</div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Star size={10}/> Rating</div>
                                    <div className="font-bold text-sm flex items-center gap-1">
                                        {placeToView.rating || 0} <span className="text-xs font-normal text-gray-500">({placeToView.reviewsCount})</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Crosshair size={10}/> Coordinates</div>
                                    <div className="font-mono text-xs">{placeToView.coordinates.lat.toFixed(4)}, {placeToView.coordinates.lng.toFixed(4)}</div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Eye size={10}/> Views</div>
                                    <div className="font-bold text-sm">{placeToView.viewCount?.toLocaleString() || 0}</div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Ticket size={10}/> Bookings</div>
                                    <div className="font-bold text-sm">{placeToView.bookingCount?.toLocaleString() || 0}</div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1"><Calendar size={10}/> Added</div>
                                    <div className="font-medium text-xs">{placeToView.createdAt ? new Date(placeToView.createdAt).toLocaleDateString() : 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
                            <div className="flex gap-3">
                                <Button 
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-11"
                                    onClick={() => handleOpenEdit(placeToView)}
                                >
                                    <Pencil size={18} className="mr-2" /> Edit Details
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    className="h-11 px-4"
                                    onClick={() => handleOpenDelete(placeToView)}
                                    title="Delete Place"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]" onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Delete Place
            </DialogTitle>
            <DialogDescription>
              {`Are you sure you want to delete ${placeToDelete?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                'Confirm Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {feedback && (
          <div className={cn(
              "fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in z-[9999] text-white",
              feedback.type === 'error' ? "bg-red-600" : (feedback.type === 'delete' ? "bg-red-500" : "bg-green-600")
          )}>
              {feedback.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <span className="font-medium">{feedback.message}</span>
          </div>
      )}

    </div>
  );
};

export default PlacesMap;