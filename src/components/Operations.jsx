// [file name]: Operations.jsx

import React, { useState, useEffect } from 'react';
import { Plus, Image, Trash2, Save } from 'lucide-react';

export default function Operations({ user }) {
  const [hotelStatus, setHotelStatus] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState({
    name: '',
    hourlyPrice: '',
    roomCount: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadHotelSettings();
    }
  }, [user]);

  const loadHotelSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/hotel-operations/${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setHotelStatus(result.data.hotelStatus);
        setRoomTypes(result.data.roomTypes || []);
      }
    } catch (error) {
      console.error('Error loading hotel settings:', error);
      alert('Error loading hotel settings');
    } finally {
      setLoading(false);
    }
  };

  const updateHotelStatus = async (status) => {
    try {
      const response = await fetch(`http://localhost:8000/api/hotel-operations/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hotelStatus: status })
      });

      const result = await response.json();
      
      if (result.success) {
        setHotelStatus(status);
      } else {
        alert('Error updating hotel status: ' + result.message);
      }
    } catch (error) {
      console.error('Update hotel status error:', error);
      alert('Error updating hotel status');
    }
  };

  // Add new room type with file upload
  const handleAddRoomType = async () => {
    if (newRoomType.name && newRoomType.hourlyPrice && newRoomType.roomCount) {
      setSaving(true);
      try {
        const formData = new FormData();
        formData.append('name', newRoomType.name);
        formData.append('hourlyPrice', newRoomType.hourlyPrice);
        formData.append('roomCount', newRoomType.roomCount);
        
        // Append all photos
        newRoomType.photos.forEach(photo => {
          formData.append('photos', photo);
        });

        const response = await fetch(`http://localhost:8000/api/hotel-operations/${user.id}/room-types`, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          setRoomTypes(result.data.roomTypes);
          setNewRoomType({ name: '', hourlyPrice: '', roomCount: '', photos: [] });
          alert('Room type added successfully!');
        } else {
          alert('Error adding room type: ' + result.message);
        }
      } catch (error) {
        console.error('Add room type error:', error);
        alert('Error adding room type');
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePhotoUpload = (e, roomTypeName = null) => {
    const files = Array.from(e.target.files);
    
    if (roomTypeName) {
      // Add photos to existing room type
      handleAddPhotos(roomTypeName, files);
    } else {
      // Add photos to new room type
      setNewRoomType({
        ...newRoomType,
        photos: [...newRoomType.photos, ...files]
      });
    }
  };

  const handleAddPhotos = async (roomTypeName, files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(
        `http://localhost:8000/api/hotel-operations/${user.id}/room-types/${roomTypeName}/photos`,
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();

      if (result.success) {
        setRoomTypes(result.data.roomTypes);
        alert('Photos added successfully!');
      } else {
        alert('Error adding photos: ' + result.message);
      }
    } catch (error) {
      console.error('Add photos error:', error);
      alert('Error adding photos');
    }
  };

  const removePhoto = (photoIndex, roomTypeName = null) => {
    if (roomTypeName) {
      alert('Photo deletion would require additional backend implementation');
    } else {
      setNewRoomType({
        ...newRoomType,
        photos: newRoomType.photos.filter((_, index) => index !== photoIndex)
      });
    }
  };

  const removeRoomType = async (roomTypeName) => {
    if (window.confirm(`Are you sure you want to delete ${roomTypeName}?`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/hotel-operations/${user.id}/room-types/${roomTypeName}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          setRoomTypes(result.data.roomTypes);
          alert('Room type deleted successfully!');
        } else {
          alert('Error deleting room type: ' + result.message);
        }
      } catch (error) {
        console.error('Delete room type error:', error);
        alert('Error deleting room type');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotel settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hotel Operations</h1>
            <p className="text-gray-600 mt-2">Manage your hotel settings and room types</p>
          </div>
          <button
            onClick={loadHotelSettings}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2"
          >
            <Save size={20} />
            Refresh Data
          </button>
        </div>

        {/* Hotel Status Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">
                {hotelStatus 
                  ? 'Your hotel is currently open and accepting bookings'
                  : 'Your hotel is currently closed and not accepting bookings'
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${hotelStatus ? 'text-green-600' : 'text-red-600'}`}>
                {hotelStatus ? 'OPEN' : 'CLOSED'}
              </span>
              <button
                onClick={() => updateHotelStatus(!hotelStatus)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  hotelStatus ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    hotelStatus ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Room Types Management */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Room Types Management</h2>

          {/* Add New Room Type Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Room Type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type Name *
                </label>
                <input
                  type="text"
                  value={newRoomType.name}
                  onChange={(e) => setNewRoomType({...newRoomType, name: e.target.value})}
                  placeholder="e.g., Standard Room, Deluxe Suite"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Price (₹) *
                </label>
                <input
                  type="number"
                  value={newRoomType.hourlyPrice}
                  onChange={(e) => setNewRoomType({...newRoomType, hourlyPrice: e.target.value})}
                  placeholder="Enter hourly price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  value={newRoomType.roomCount}
                  onChange={(e) => setNewRoomType({...newRoomType, roomCount: e.target.value})}
                  placeholder="e.g., 10, 20, 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Room Photos {newRoomType.photos.length > 0 && `(${newRoomType.photos.length})`}
              </label>
              
              {newRoomType.photos.length > 0 ? (
                <div className="flex flex-wrap gap-4 mb-4">
                  {newRoomType.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Room photo ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No photos added yet</p>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e)}
                className="hidden"
                id="new-room-photos"
              />
              <label
                htmlFor="new-room-photos"
                className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-red-500 transition-colors bg-white"
              >
                <Image size={24} className="text-gray-500" />
                <span className="text-gray-700 font-medium">Upload Room Photos</span>
              </label>
            </div>

            <button
              onClick={handleAddRoomType}
              disabled={!newRoomType.name || !newRoomType.hourlyPrice || !newRoomType.roomCount || saving}
              className="flex items-center gap-3 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <Plus size={20} />
              {saving ? 'Adding...' : 'Add Room Type'}
            </button>
          </div>

          {/* Existing Room Types */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Existing Room Types {roomTypes.length > 0 && `(${roomTypes.length})`}
            </h3>
            
            {roomTypes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-gray-400 mb-4">
                  <Image size={48} className="mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No Room Types Added</h4>
                <p className="text-gray-500">Start by adding your first room type above</p>
              </div>
            ) : (
              roomTypes.map((roomType) => (
                <div key={roomType._id || roomType.name} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{roomType.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Hourly Price</p>
                          <p className="text-lg font-bold text-gray-900">₹{roomType.hourlyPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Room Count</p>
                          <p className="text-lg font-bold text-gray-900">{roomType.roomCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created Rooms</p>
                          <p className="text-lg font-bold text-gray-900">{roomType.rooms?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeRoomType(roomType.name)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-4 p-2"
                      title="Delete room type"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Room Status Summary */}
                  {roomType.rooms && roomType.rooms.length > 0 && (
                    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Room Status Summary</h4>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">
                          Vacant: {roomType.rooms.filter(r => r.status === 'vacant').length}
                        </span>
                        <span className="text-red-600">
                          Booked: {roomType.rooms.filter(r => r.status === 'booked').length}
                        </span>
                        <span className="text-yellow-600">
                          Maintenance: {roomType.rooms.filter(r => r.status === 'maintenance').length}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Photos Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Room Photos {roomType.photos?.length > 0 && `(${roomType.photos.length})`}
                    </label>
                    
                    {roomType.photos?.length > 0 ? (
                      <div className="flex flex-wrap gap-4 mb-4">
                        {roomType.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`http://localhost:8000${photo}`}
                              alt={`${roomType.name} photo ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/96?text=No+Image';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">No photos added for this room type</p>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoUpload(e, roomType.name)}
                      className="hidden"
                      id={`room-photos-${roomType._id || roomType.name}`}
                    />
                    <label
                      htmlFor={`room-photos-${roomType._id || roomType.name}`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors bg-white text-gray-700"
                    >
                      <Image size={16} />
                      <span>Add More Photos</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
