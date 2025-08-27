import React, { useState, useRef } from 'react';
import { Plus, Upload, Folder, Grid, Calendar, Filter, X, Heart, Play, Mic, MicOff } from 'lucide-react';
import { Card } from './Card';

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  story: string;
  date: Date;
  folderId: string;
  aiTags?: string[];
}

interface GalleryFolder {
  id: string;
  name: string;
  coverImage?: string;
  itemCount: number;
}

const PetGallery: React.FC = () => {
  const [folders, setFolders] = useState<GalleryFolder[]>([
    { id: 'all', name: 'All Photos', itemCount: 0 },
    { id: 'favorites', name: 'Favorites ❤️', itemCount: 0 }
  ]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'folder'>('date');
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [currentStory, setCurrentStory] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: GalleryFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      itemCount: 0
    };
    
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setShowCreateFolder(false);
  };

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 'photo';
      
      // AI Auto-tagging simulation
      const aiTags = await generateAITags(file);
      
      const newItem: MediaItem = {
        id: Date.now().toString() + i,
        type,
        url,
        story: '',
        date: new Date(),
        folderId: selectedFolder === 'all' ? 'general' : selectedFolder,
        aiTags
      };
      
      setMediaItems(prev => [...prev, newItem]);
      
      // Update folder count
      setFolders(prev => prev.map(folder => 
        folder.id === selectedFolder || (selectedFolder === 'all' && folder.id === 'general')
          ? { ...folder, itemCount: folder.itemCount + 1, coverImage: folder.coverImage || url }
          : folder
      ));
    }
    setShowUpload(false);
  };

  const generateAITags = async (file: File): Promise<string[]> => {
    // Simulate AI tagging
    const tags = ['dog', 'happy', 'outdoor', 'playing'];
    return tags.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateAICaption = async (mediaItem: MediaItem): Promise<string> => {
    const captions = [
      "Your furry friend looks absolutely adorable! 🐶✨",
      "What a precious moment captured! 📸💕",
      "This photo radiates pure joy and happiness! 🌟",
      "Such a beautiful memory to treasure forever! 🥰"
    ];
    return captions[Math.floor(Math.random() * captions.length)];
  };

  const filteredItems = mediaItems
    .filter(item => selectedFolder === 'all' || item.folderId === selectedFolder)
    .filter(item => filterType === 'all' || item.type === filterType)
    .sort((a, b) => sortBy === 'date' ? b.date.getTime() - a.date.getTime() : a.folderId.localeCompare(b.folderId));

  const updateStory = (itemId: string, story: string) => {
    setMediaItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, story } : item
    ));
    if (selectedMedia && selectedMedia.id === itemId) {
      setSelectedMedia({ ...selectedMedia, story });
    }
  };

  const deleteMedia = (itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedMedia(null);
    // Update folder counts
    setFolders(prev => prev.map(folder => ({
      ...folder,
      itemCount: Math.max(0, folder.itemCount - 1)
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🐾 Pet Gallery</h1>
          <p className="text-lg text-gray-600">Capture and cherish your precious pet memories</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'folder')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="folder">Sort by Folder</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'photo' | 'video')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Media</option>
              <option value="photo">Photos Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Media</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Folders */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Folder className="h-5 w-5 mr-2" />
                Albums
              </h2>
              
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedFolder === folder.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{folder.name}</span>
                      <span className="text-sm text-gray-500">{folder.itemCount}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowCreateFolder(true)}
                className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>New Album</span>
              </button>
            </Card>
          </div>

          {/* Main Gallery */}
          <div className="lg:col-span-3">
            {filteredItems.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No memories yet</h3>
                <p className="text-gray-500 mb-6">Start uploading your precious pet moments!</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Upload First Photo
                </button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      {item.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video src={item.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      ) : (
                        <img src={item.url} alt="Pet memory" className="w-full h-full object-cover" />
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm line-clamp-3">
                            {item.story || 'No story added yet...'}
                          </p>
                        </div>
                      </div>
                      
                      {/* AI Tags */}
                      {item.aiTags && item.aiTags.length > 0 && (
                        <div className="absolute top-2 left-2">
                          <div className="flex flex-wrap gap-1">
                            {item.aiTags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMedia(item.id);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="p-3">
                      <p className="text-xs text-gray-500">
                        {item.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Create Folder Button */}
        <button
          onClick={() => setShowCreateFolder(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Media</h3>
                <button onClick={() => setShowUpload(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to select photos and videos</p>
                <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, MP4, MOV</p>
              </div>
            </Card>
          </div>
        )}

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Album</h3>
                <button onClick={() => setShowCreateFolder(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Album name (e.g., 'Tommy's Birthday')"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-full overflow-auto">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="relative">
                  {selectedMedia.type === 'video' ? (
                    <video src={selectedMedia.url} controls className="w-full max-h-96 object-contain" />
                  ) : (
                    <img src={selectedMedia.url} alt="Pet memory" className="w-full max-h-96 object-contain" />
                  )}
                  
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{selectedMedia.date.toLocaleDateString()}</p>
                      {selectedMedia.aiTags && (
                        <div className="flex flex-wrap gap-2">
                          {selectedMedia.aiTags.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateAICaption(selectedMedia).then(caption => {
                          updateStory(selectedMedia.id, caption);
                        })}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm hover:bg-purple-200"
                      >
                        ✨ AI Suggest
                      </button>
                      <button
                        onClick={() => deleteMedia(selectedMedia.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={selectedMedia.story || ''}
                    onChange={(e) => updateStory(selectedMedia.id, e.target.value)}
                    placeholder="Add your memory or story about this moment... 🐾"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetGallery;