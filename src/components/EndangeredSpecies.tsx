import React, { useState, useEffect } from 'react';
import { Search, Heart, ExternalLink } from 'lucide-react';

interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  category: string;
  status: string;
  region: string;
  habitat: string;
  image: string;
  population?: string;
  threats?: string[];
}

const EndangeredSpecies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedHabitat, setSelectedHabitat] = useState('All');
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Amphibians', 'Mammals', 'Birds', 'Sharks & Rays', 'Reptiles', 'Reef Corals', 'Cycads', 'Conifers', 'Selected Crustaceans'];
  const statuses = ['All', 'Critically Endangered', 'Endangered', 'Vulnerable', 'Near Threatened'];
  const habitats = ['All', 'Forest', 'Marine', 'Freshwater', 'Grassland', 'Desert', 'Mountain', 'Wetland', 'Coral Reef'];

  const statistics = {
    threatened: '47,677',
    amphibians: '41%',
    mammals: '26%',
    birds: '13%',
    reptiles: '21%',
    sharks: '37%',
    corals: '33%'
  };

  const fallbackSpecies: Species[] = [
    {
      id: '1',
      commonName: 'Amur Leopard',
      scientificName: 'Panthera pardus orientalis',
      category: 'Mammals',
      status: 'Critically Endangered',
      region: 'Russia, China',
      habitat: 'Forest',
      image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '100-120',
      threats: ['Poaching', 'Habitat loss', 'Climate change']
    },
    {
      id: '2',
      commonName: 'Vaquita',
      scientificName: 'Phocoena sinus',
      category: 'Mammals',
      status: 'Critically Endangered',
      region: 'Mexico',
      habitat: 'Marine',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '10-30',
      threats: ['Fishing nets', 'Illegal fishing', 'Pollution']
    },
    {
      id: '3',
      commonName: 'Javan Rhinoceros',
      scientificName: 'Rhinoceros sondaicus',
      category: 'Mammals',
      status: 'Critically Endangered',
      region: 'Indonesia',
      habitat: 'Forest',
      image: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '60-70',
      threats: ['Habitat loss', 'Disease', 'Natural disasters']
    },
    {
      id: '4',
      commonName: 'Hawksbill Turtle',
      scientificName: 'Eretmochelys imbricata',
      category: 'Reptiles',
      status: 'Critically Endangered',
      region: 'Tropical oceans',
      habitat: 'Marine',
      image: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '15,000-20,000',
      threats: ['Illegal trade', 'Climate change', 'Pollution']
    },
    {
      id: '5',
      commonName: 'Sumatran Orangutan',
      scientificName: 'Pongo abelii',
      category: 'Mammals',
      status: 'Critically Endangered',
      region: 'Indonesia',
      habitat: 'Forest',
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '14,000',
      threats: ['Deforestation', 'Palm oil', 'Illegal pet trade']
    },
    {
      id: '6',
      commonName: 'Great White Shark',
      scientificName: 'Carcharodon carcharias',
      category: 'Sharks & Rays',
      status: 'Vulnerable',
      region: 'Global oceans',
      habitat: 'Marine',
      image: 'https://images.pexels.com/photos/544551/pexels-photo-544551.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: 'Unknown',
      threats: ['Overfishing', 'Bycatch', 'Habitat degradation']
    },
    {
      id: '7',
      commonName: 'Mountain Gorilla',
      scientificName: 'Gorilla beringei beringei',
      category: 'Mammals',
      status: 'Critically Endangered',
      region: 'Rwanda, Uganda, DR Congo',
      habitat: 'Mountain',
      image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '1,000+',
      threats: ['Habitat loss', 'Poaching', 'Disease']
    },
    {
      id: '8',
      commonName: 'Kihansi Spray Toad',
      scientificName: 'Nectophrynoides asperginis',
      category: 'Amphibians',
      status: 'Critically Endangered',
      region: 'Tanzania',
      habitat: 'Freshwater',
      image: 'https://images.pexels.com/photos/70083/frog-macro-amphibian-green-70083.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '6,000+',
      threats: ['Dam construction', 'Habitat loss', 'Disease']
    },
    {
      id: '9',
      commonName: 'Kakapo',
      scientificName: 'Strigops habroptilus',
      category: 'Birds',
      status: 'Critically Endangered',
      region: 'New Zealand',
      habitat: 'Forest',
      image: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '250+',
      threats: ['Introduced predators', 'Habitat loss', 'Disease']
    },
    {
      id: '10',
      commonName: 'Staghorn Coral',
      scientificName: 'Acropora cervicornis',
      category: 'Reef Corals',
      status: 'Critically Endangered',
      region: 'Caribbean',
      habitat: 'Coral Reef',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: 'Severely depleted',
      threats: ['Climate change', 'Ocean acidification', 'Disease']
    },
    {
      id: '11',
      commonName: 'Snow Leopard',
      scientificName: 'Panthera uncia',
      category: 'Mammals',
      status: 'Vulnerable',
      region: 'Central Asia',
      habitat: 'Mountain',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '2,700-3,400',
      threats: ['Poaching', 'Human conflict', 'Climate change']
    },
    {
      id: '12',
      commonName: 'African Elephant',
      scientificName: 'Loxodonta africana',
      category: 'Mammals',
      status: 'Endangered',
      region: 'Africa',
      habitat: 'Grassland',
      image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '415,000',
      threats: ['Poaching', 'Habitat loss', 'Human conflict']
    },
    {
      id: '13',
      commonName: 'Green Sea Turtle',
      scientificName: 'Chelonia mydas',
      category: 'Reptiles',
      status: 'Endangered',
      region: 'Global oceans',
      habitat: 'Marine',
      image: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '85,000-90,000',
      threats: ['Plastic pollution', 'Climate change', 'Fishing nets']
    },
    {
      id: '14',
      commonName: 'Polar Bear',
      scientificName: 'Ursus maritimus',
      category: 'Mammals',
      status: 'Vulnerable',
      region: 'Arctic',
      habitat: 'Marine',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '22,000-31,000',
      threats: ['Climate change', 'Sea ice loss', 'Pollution']
    },
    {
      id: '15',
      commonName: 'California Condor',
      scientificName: 'Gymnogyps californianus',
      category: 'Birds',
      status: 'Critically Endangered',
      region: 'California, USA',
      habitat: 'Mountain',
      image: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=400',
      population: '500+',
      threats: ['Lead poisoning', 'Habitat loss', 'Power lines']
    }
  ];

  const fetchSpeciesData = async () => {
    setLoading(true);
    try {
      const prompt = `List 15 real endangered species with this format: CommonName|ScientificName|Category|Status|Region|Habitat|Population|Threat1,Threat2,Threat3

Categories: Mammals, Birds, Reptiles, Amphibians, Sharks & Rays, Reef Corals
Statuses: Critically Endangered, Endangered, Vulnerable, Near Threatened
Habitats: Forest, Marine, Freshwater, Grassland, Desert, Mountain, Wetland, Coral Reef

Example: Amur Leopard|Panthera pardus orientalis|Mammals|Critically Endangered|Russia, China|Forest|100-120|Poaching,Habitat loss,Climate change`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeGrdNlhxR_7UrxU0Lqyb8kUNo7-6uKIk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          const lines = text.split('\n').filter(line => line.includes('|'));
          const apiSpecies = lines.map((line, index) => {
            const parts = line.split('|');
            if (parts.length >= 8) {
              return {
                id: `api_${index}`,
                commonName: parts[0].trim(),
                scientificName: parts[1].trim(),
                category: parts[2].trim(),
                status: parts[3].trim(),
                region: parts[4].trim(),
                habitat: parts[5].trim(),
                population: parts[6].trim(),
                threats: parts[7].split(',').map(t => t.trim()),
                image: fallbackSpecies[index % fallbackSpecies.length].image
              };
            }
            return null;
          }).filter(Boolean);
          
          if (apiSpecies.length > 0) {
            setSpecies(apiSpecies as Species[]);
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.error('API Error:', error);
    }
    
    setSpecies(fallbackSpecies);
    setLoading(false);
  };

  useEffect(() => {
    fetchSpeciesData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critically Endangered': return 'bg-red-600';
      case 'Endangered': return 'bg-orange-500';
      case 'Vulnerable': return 'bg-yellow-500';
      case 'Near Threatened': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredSpecies = species.filter(s => {
    const matchesSearch = !searchTerm || 
      s.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.habitat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesHabitat = selectedHabitat === 'All' || s.habitat === selectedHabitat;
    return matchesSearch && matchesCategory && matchesStatus && matchesHabitat;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* IUCN Header */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">The IUCN Red List of Threatened Species™</h1>
              <p className="text-red-100">A Critical Indicator of the Health of the World's Biodiversity</p>
            </div>
            <button
              onClick={() => window.open('https://www.iucnredlist.org/support/donate', '_blank')}
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>Donate Now</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by common name, scientific name, or region…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-lg border-0 focus:ring-2 focus:ring-red-300"
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-red-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{statistics.threatened}</div>
              <div className="text-sm text-red-100">Species threatened with extinction</div>
            </div>
            <div className="bg-red-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{statistics.amphibians}</div>
              <div className="text-sm text-red-100">Amphibians</div>
            </div>
            <div className="bg-red-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{statistics.mammals}</div>
              <div className="text-sm text-red-100">Mammals</div>
            </div>
            <div className="bg-red-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{statistics.birds}</div>
              <div className="text-sm text-red-100">Birds</div>
            </div>
            <div className="bg-red-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{statistics.reptiles}</div>
              <div className="text-sm text-red-100">Reptiles</div>
            </div>
            <div className="bg-red-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{statistics.sharks}</div>
              <div className="text-sm text-red-100">Sharks & Rays</div>
            </div>
            <div className="bg-red-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{statistics.corals}</div>
              <div className="text-sm text-red-100">Reef Corals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Conservation Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Habitat</h3>
                <div className="flex flex-wrap gap-2">
                  {habitats.map((habitat) => (
                    <button
                      key={habitat}
                      onClick={() => setSelectedHabitat(habitat)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedHabitat === habitat
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {habitat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Species Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading endangered species data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpecies.map((species) => (
            <div key={species.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                <button
                  onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(species.commonName + ' ' + species.scientificName)}`, '_blank')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Animal</span>
                </button>
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(species.status)}`}>
                  {species.status.toUpperCase()}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{species.commonName}</h3>
                <p className="text-sm text-gray-600 italic mb-2">{species.scientificName}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{species.category}</span>
                    <span>{species.region}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div><strong>Habitat:</strong> {species.habitat}</div>
                    {species.population && <div><strong>Population:</strong> {species.population}</div>}
                  </div>
                  {species.threats && species.threats.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {species.threats.slice(0, 2).map((threat, index) => (
                        <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                          {threat}
                        </span>
                      ))}
                      {species.threats.length > 2 && (
                        <span className="text-xs text-gray-500">+{species.threats.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-red-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Help us make The IUCN Red List a more complete barometer of life
          </h2>
          <p className="text-gray-600 mb-6">
            Your support helps us assess more species and provide critical conservation information to protect biodiversity worldwide.
          </p>
          <button
            onClick={() => window.open('https://www.iucnredlist.org/support/donate', '_blank')}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
          >
            <Heart className="h-5 w-5" />
            <span>Support Conservation</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Assessment Process</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Resources</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Publications</a>
            <a 
              href="https://www.iucnredlist.org/support/donate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>Support Us</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 International Union for Conservation of Nature and Natural Resources</p>
            <p className="mt-2">IUCN Red List of Threatened Species™. Version 2024-1</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EndangeredSpecies;