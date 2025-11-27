import React, { useState } from 'react';
import { Plus, Image, Trash2 } from 'lucide-react';

export default function Operations() {
  const [hotelStatus, setHotelStatus] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState({
    name: '',
    hourlyPrice: '',
    photos: []
  });

  // Add new room type
  const handleAddRoomType = () => {
    if (newRoomType.name && newRoomType.hourlyPrice) {
      setRoomTypes([
        ...roomTypes,
        {
          id: Date.now(),
          name: newRoomType.name,
          hourlyPrice: parseInt(newRoomType.hourlyPrice),
          photos: newRoomType.photos
        }
      ]);
      // Reset form
      setNewRoomType({ name: '', hourlyPrice: '', photos: [] });
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e, roomId = null) => {
    const files = Array.from(e.target.files);
    if (roomId) {
      setRoomTypes(roomTypes.map(room => 
        room.id === roomId 
          ? { ...room, photos: [...room.photos, ...files] }
          : room
      ));
    } else {
      setNewRoomType({
        ...newRoomType,
        photos: [...newRoomType.photos, ...files]
      });
    }
  };

  // Remove photo
  const removePhoto = (photoIndex, roomId = null) => {
    if (roomId) {
      setRoomTypes(roomTypes.map(room =>
        room.id === roomId
          ? { ...room, photos: room.photos.filter((_, index) => index !== photoIndex) }
          : room
      ));
    } else {
      setNewRoomType({
        ...newRoomType,
        photos: newRoomType.photos.filter((_, index) => index !== photoIndex)
      });
    }
  };

  // Remove room type
  const removeRoomType = (roomId) => {
    setRoomTypes(roomTypes.filter(room => room.id !== roomId));
  };

  // Update room type
  const updateRoomType = (roomId, field, value) => {
    setRoomTypes(roomTypes.map(room =>
      room.id === roomId ? { ...room, [field]: value } : room
    ));
  };

  // Submit all changes
  const handleSubmitAll = () => {
    console.log('Hotel Status:', hotelStatus ? 'Open' : 'Closed');
    console.log('Room Types:', roomTypes);
    alert('All changes saved successfully!');
  };

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
            onClick={handleSubmitAll}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Save All Changes
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
                onClick={() => setHotelStatus(!hotelStatus)}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                <div className="mt-1 text-sm text-gray-500">
                  {newRoomType.name ? (
                    <span className="text-green-600">✓ You entered: <strong>{newRoomType.name}</strong></span>
                  ) : (
                    "Enter a name for this room type"
                  )}
                </div>
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
                <div className="mt-1 text-sm text-gray-500">
                  {newRoomType.hourlyPrice ? (
                    <span className="text-green-600">✓ Price set: <strong>₹{newRoomType.hourlyPrice}/hour</strong></span>
                  ) : (
                    "Set the hourly rate for this room"
                  )}
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Room Photos {newRoomType.photos.length > 0 && `(${newRoomType.photos.length})`}
              </label>
              
              {/* Photo Previews */}
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

              {/* Upload Button */}
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
              disabled={!newRoomType.name || !newRoomType.hourlyPrice}
              className="flex items-center gap-3 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <Plus size={20} />
              Add Room Type
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
              roomTypes.map((room) => (
                <div key={room.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Room Type Name
                        </label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => updateRoomType(room.id, 'name', e.target.value)}
                          placeholder="Enter room type name"
                          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hourly Price
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">₹</span>
                          <input
                            type="number"
                            value={room.hourlyPrice}
                            onChange={(e) => updateRoomType(room.id, 'hourlyPrice', parseInt(e.target.value) || 0)}
                            placeholder="Enter hourly price"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500 w-32"
                          />
                          <span className="text-gray-600">per hour</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeRoomType(room.id)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-4 p-2"
                      title="Delete room type"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Photos Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Room Photos {room.photos.length > 0 && `(${room.photos.length})`}
                    </label>
                    
                    {/* Photo Previews */}
                    {room.photos.length > 0 ? (
                      <div className="flex flex-wrap gap-4 mb-4">
                        {room.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`${room.name} photo ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              onClick={() => removePhoto(index, room.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              title="Remove photo"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">No photos added for this room type</p>
                    )}

                    {/* Add More Photos */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoUpload(e, room.id)}
                      className="hidden"
                      id={`room-photos-${room.id}`}
                    />
                    <label
                      htmlFor={`room-photos-${room.id}`}
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