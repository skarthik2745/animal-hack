import React, { useState, useRef, useEffect } from 'react';
import { Plus, Upload, Folder, Grid, Calendar, Filter, X, Heart, Play, Mic, MicOff } from 'lucide-react';
import { Card } from './Card';

// Modern Gallery Styles
const galleryStyles = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap');

.gallery-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.gallery-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  opacity: 0.8;
  animation: floatHearts 10s linear infinite;
  font-size: 20px;
  user-select: none;
  pointer-events: none;
}

@keyframes floatHearts {
  0% { 
    transform: translateX(0px) translateY(100vh) rotate(0deg); 
    opacity: 0;
  }
  10% { 
    opacity: 0.8;
  }
  90% { 
    opacity: 0.8;
  }
  100% { 
    transform: translateX(var(--drift)) translateY(-100px) rotate(360deg); 
    opacity: 0;
  }
}

.gallery-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.gallery-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.media-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.media-card:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15), 0 0 20px rgba(102, 126, 234, 0.3);
}

.gradient-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-family: 'Nunito', sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.gradient-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.gradient-btn-teal {
  background: linear-gradient(135deg, #4fd1c7 0%, #06b6d4 100%);
}

.gradient-btn-orange {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}

.gradient-btn-purple {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
}

.lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.lightbox-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

@media (prefers-reduced-motion: reduce) {
  .floating-shape { animation: none; }
  .gallery-container::before { animation: none; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = galleryStyles;
  document.head.appendChild(styleElement);
}

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

  // Generate floating hearts
  useEffect(() => {
    const createFloatingHearts = () => {
      const container = document.querySelector('.floating-shapes');
      if (!container) return;
      
      container.innerHTML = '';
      
      const colors = ['#ff1744', '#e91e63', '#9c27b0', '#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#dda0dd'];
      
      for (let i = 0; i < 60; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-shape';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 10 + 16) + 'px';
        heart.style.animationDuration = (Math.random() * 6 + 8) + 's';
        heart.style.animationDelay = Math.random() * -10 + 's';
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
        container.appendChild(heart);
      }
    };
    
    createFloatingHearts();
  }, []);

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
    <div className="gallery-container pt-20">
      <div className="floating-shapes"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-7xl font-black mb-6" style={{
            fontFamily: 'Nunito, sans-serif',
            color: 'white',
            textShadow: '0 0 20px rgba(255,255,255,0.5), 0 4px 8px rgba(0,0,0,0.3)',
            letterSpacing: '2px',
            fontWeight: 900
          }}>Pet Gallery</h1>
          <p className="text-2xl text-white font-semibold mb-4" style={{ 
            fontFamily: 'Nunito, sans-serif', 
            textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            letterSpacing: '1px'
          }}>
            Capture and cherish your precious pet memories ✨
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'folder')}
              className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <option value="date">📅 Sort by Date</option>
              <option value="folder">📁 Sort by Folder</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'photo' | 'video')}
              className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <option value="all">🎯 All Media</option>
              <option value="photo">📸 Photos Only</option>
              <option value="video">🎥 Videos Only</option>
            </select>
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="gradient-btn gradient-btn-teal px-6 py-3 flex items-center space-x-2 text-lg"
          >
            <Upload className="h-5 w-5" />
            <span>✨ Upload Media</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Folders */}
          <div className="lg:col-span-1">
            <div className="gallery-card p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ 
                fontFamily: 'Nunito, sans-serif', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <Folder className="h-6 w-6 mr-3 text-pink-500" />
                Albums 📁
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
                className="gradient-btn gradient-btn-purple w-full mt-6 p-4 rounded-xl flex items-center justify-center space-x-2 font-semibold text-lg"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <Plus className="h-5 w-5" />
                <span>✨ New Album</span>
              </button>
            </div>
          </div>

          {/* Main Gallery */}
          <div className="lg:col-span-3">
            {filteredItems.length === 0 ? (
              <div className="gallery-card p-12 text-center">
                <div className="text-8xl mb-6">📸✨</div>
                <h3 className="text-2xl font-bold mb-4" style={{
                  fontFamily: 'Nunito, sans-serif',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>No memories yet! 🐾</h3>
                <p className="text-gray-600 mb-8 text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Start uploading your precious pet moments and create beautiful memories! 💕
                </p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="gradient-btn gradient-btn-orange px-8 py-4 text-lg font-semibold"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  🎉 Upload First Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="media-card group relative"
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
          className="gradient-btn gradient-btn-purple fixed bottom-6 right-6 p-4 rounded-full z-50 shadow-2xl"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Upload Modal */}
        {showUpload && (
          <div className="modal-backdrop">
            <div className="modal-content p-6">
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
                className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
              >
                <Upload className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>📸 Click to select photos and videos</p>
                <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>Supports JPG, PNG, MP4, MOV ✨</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="modal-backdrop">
            <div className="modal-content p-6">
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all duration-300"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className="gradient-btn gradient-btn-teal flex-1 px-4 py-3 disabled:opacity-50"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  ✨ Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedMedia && (
          <div className="lightbox-modal">
            <div className="lightbox-content">
              <button
                onClick={() => setSelectedMedia(null)}
                className="lightbox-close"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="relative">
                {selectedMedia.type === 'video' ? (
                  <video src={selectedMedia.url} controls className="w-full max-h-[70vh] object-contain" />
                ) : (
                  <img src={selectedMedia.url} alt="Pet memory" className="w-full max-h-[70vh] object-contain" />
                )}
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
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => generateAICaption(selectedMedia).then(caption => {
                        updateStory(selectedMedia.id, caption);
                      })}
                      className="gradient-btn gradient-btn-purple px-4 py-2 text-sm"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      ✨ AI Suggest
                    </button>
                    <button
                      onClick={() => deleteMedia(selectedMedia.id)}
                      className="gradient-btn gradient-btn-orange px-4 py-2 text-sm"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
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
        )}
      </div>
    </div>
  );
};

export default PetGallery;