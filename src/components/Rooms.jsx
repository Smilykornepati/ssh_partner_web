// [file name]: Rooms.jsx

import React, { useState, useEffect } from 'react';
import { Building, Bed, Wrench, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function Rooms({ user }) {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load room data
  useEffect(() => {
    if (user?.id) {
      loadRoomData();
    }
  }, [user]);

  const loadRoomData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/hotel-operations/${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setRoomTypes(result.data.roomTypes || []);
      }
    } catch (error) {
      console.error('Error loading room data:', error);
      alert('Error loading room data');
    } finally {
      setLoading(false);
    }
  };

  const updateRoomStatus = async (roomNumber, newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/hotel-operations/${user.id}/rooms/${roomNumber}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update local state
        setRoomTypes(prevTypes => 
          prevTypes.map(roomType => ({
            ...roomType,
            rooms: roomType.rooms.map(room =>
              room.roomNumber === roomNumber ? { ...room, status: newStatus } : room
            )
          }))
        );
      } else {
        alert('Error updating room status: ' + result.message);
      }
    } catch (error) {
      console.error('Update room status error:', error);
      alert('Error updating room status');
    } finally {
      setUpdating(false);
    }
  };

  const bulkUpdateStatus = async (roomTypeName, newStatus) => {
    if (window.confirm(`Set all ${roomTypeName} rooms to ${newStatus}?`)) {
      setUpdating(true);
      try {
        const roomType = roomTypes.find(rt => rt.name === roomTypeName);
        const roomUpdates = roomType.rooms.map(room => ({
          roomNumber: room.roomNumber,
          status: newStatus
        }));

        const response = await fetch(
          `http://localhost:8000/api/hotel-operations/${user.id}/rooms/bulk-status`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomUpdates })
          }
        );

        const result = await response.json();

        if (result.success) {
          setRoomTypes(result.data.roomTypes);
          alert(`Updated ${roomUpdates.length} rooms to ${newStatus}`);
        } else {
          alert('Error updating rooms: ' + result.message);
        }
      } catch (error) {
        console.error('Bulk update error:', error);
        alert('Error updating rooms');
      } finally {
        setUpdating(false);
      }
    }
  };

  const getStatusCounts = (rooms) => {
    return {
      total: rooms?.length || 0,
      booked: rooms?.filter(room => room.status === 'booked').length || 0,
      vacant: rooms?.filter(room => room.status === 'vacant').length || 0,
      maintenance: rooms?.filter(room => room.status === 'maintenance').length || 0
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'vacant': return 'bg-green-100 text-green-800 border-green-300';
      case 'booked': return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'vacant': return <CheckCircle size={16} />;
      case 'booked': return <XCircle size={16} />;
      case 'maintenance': return <Wrench size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading room data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
            <p className="text-gray-600 mt-2">Manage room status and availability</p>
          </div>
          <button
            onClick={loadRoomData}
            disabled={updating}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-semibold flex items-center gap-2"
          >
            <RefreshCw size={20} className={updating ? 'animate-spin' : ''} />
            {updating ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Room Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {roomTypes.map((roomType) => {
            const counts = getStatusCounts(roomType.rooms);
            return (
              <div key={roomType._id || roomType.name} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Building className="text-red-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{roomType.name}</h3>
                      <p className="text-sm text-gray-600">₹{roomType.hourlyPrice}/hour</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
                    <p className="text-sm text-gray-600">Total Rooms</p>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-lg font-bold text-gray-900">{counts.vacant}</span>
                    </div>
                    <p className="text-xs text-gray-600">Vacant</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-lg font-bold text-gray-900">{counts.booked}</span>
                    </div>
                    <p className="text-xs text-gray-600">Booked</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-lg font-bold text-gray-900">{counts.maintenance}</span>
                    </div>
                    <p className="text-xs text-gray-600">Maintenance</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${counts.total > 0 ? (counts.vacant / counts.total) * 100 : 0}%` }}
                  ></div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => bulkUpdateStatus(roomType.name, 'vacant')}
                    className="flex-1 bg-green-500 text-white py-2 rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    All Vacant
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus(roomType.name, 'maintenance')}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded text-sm hover:bg-yellow-600 transition-colors"
                  >
                    All Maintenance
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Room List */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Rooms</h2>
          
          {roomTypes.length === 0 ? (
            <div className="text-center py-12">
              <Building size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Room Types Found</h3>
              <p className="text-gray-500">Add room types in the Operations section first</p>
            </div>
          ) : (
            roomTypes.map((roomType) => (
              <div key={roomType._id || roomType.name} className="mb-8 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="text-red-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">{roomType.name}</h3>
                  <span className="text-sm text-gray-500">({roomType.roomCount} rooms)</span>
                </div>
                
                {roomType.rooms && roomType.rooms.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {roomType.rooms.map((room) => (
                      <div
                        key={room.roomNumber}
                        className={`border-2 rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${getStatusColor(room.status)}`}
                        onClick={() => {
                          const newStatus = prompt(
                            `Change status for ${room.roomNumber}:\n\n1. vacant\n2. booked\n3. maintenance`,
                            room.status
                          );
                          if (newStatus && ['vacant', 'booked', 'maintenance'].includes(newStatus)) {
                            updateRoomStatus(room.roomNumber, newStatus);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Bed size={20} className="text-gray-600" />
                          {getStatusIcon(room.status)}
                        </div>
                        <p className="font-semibold text-lg mb-1">{room.roomNumber}</p>
                        <p className="text-sm capitalize">{room.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No rooms created for this type</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
