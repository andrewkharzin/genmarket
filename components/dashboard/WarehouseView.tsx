import React, { useState } from 'react';
import { Warehouse, ItemBatch, InventoryMovement, StorageZone } from '../../types';
import { MOCK_BATCHES, MOCK_MOVEMENTS, MOCK_ITEMS } from '../../constants';
import { 
  Container, Grid, Box, Layers, ClipboardList, ArrowRightLeft, 
  Plus, Calendar, Truck, AlertTriangle, Map, LayoutGrid, Archive, X, Check
} from 'lucide-react';

interface WarehouseViewProps {
  warehouses: Warehouse[];
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({ warehouses: initialWarehouses }) => {
  // Local state to handle UI updates (mock backend persistence)
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [activeTab, setActiveTab] = useState<'overview' | 'layout' | 'batches' | 'movements'>('overview');
  const [batches, setBatches] = useState<ItemBatch[]>(MOCK_BATCHES);
  const [movements, setMovements] = useState<InventoryMovement[]>(MOCK_MOVEMENTS);

  // Modal & Form States
  const [isReceiving, setIsReceiving] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  
  // Forms
  const [newItemBatch, setNewItemBatch] = useState({ itemId: '', qty: '', batchNo: '' });
  const [newMovement, setNewMovement] = useState({ itemId: '', from: '', to: '', qty: '' });
  const [newZone, setNewZone] = useState({ name: '', code: '', type: 'rack' as StorageZone['type'], bins: 10 });

  const handleReceiveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: ItemBatch = {
      id: `batch-${Date.now()}`,
      item_id: newItemBatch.itemId,
      batch_number: newItemBatch.batchNo,
      quantity_received: Number(newItemBatch.qty),
      quantity_available: Number(newItemBatch.qty),
      received_date: new Date().toISOString(),
      status: 'active'
    };
    setBatches([newBatch, ...batches]);
    setIsReceiving(false);
    setNewItemBatch({ itemId: '', qty: '', batchNo: '' });
  };

  const handleMoveStock = (e: React.FormEvent) => {
    e.preventDefault();
    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      item_id: newMovement.itemId,
      location_from_id: newMovement.from,
      location_to_id: newMovement.to,
      user_id: 'current-user', // Simplified
      movement_type: 'transfer',
      quantity: Number(newMovement.qty),
      created_at: new Date().toISOString(),
      notes: 'Manual transfer'
    };
    setMovements([movement, ...movements]);
    setIsMoving(false);
    setNewMovement({ itemId: '', from: '', to: '', qty: '' });
  };

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZone.name || !newZone.code) return;

    const newZoneObj: StorageZone = {
      id: `zone-${Date.now()}`,
      name: newZone.name,
      code: newZone.code.toUpperCase(),
      type: newZone.type,
      bins_count: Number(newZone.bins)
    };

    // Add to the first warehouse for demo purposes (or currently selected warehouse)
    const updatedWarehouses = warehouses.map((wh, idx) => {
      if (idx === 0) { // Targeting first warehouse
        return {
          ...wh,
          zones: [...wh.zones, newZoneObj]
        };
      }
      return wh;
    });

    setWarehouses(updatedWarehouses);
    setIsAddZoneModalOpen(false);
    setNewZone({ name: '', code: '', type: 'rack', bins: 10 });
  };

  // --- Sub-Views ---

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {warehouses.map(wh => (
           <div key={wh.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                   <Container className="w-5 h-5 text-brand-600" /> {wh.name}
                 </h3>
                 <p className="text-sm text-slate-500 font-mono mt-1">{wh.code} • {wh.type.toUpperCase()}</p>
               </div>
               <div className="text-right">
                 <div className="text-2xl font-bold text-slate-900">{wh.occupancy_percentage}%</div>
                 <div className="text-xs text-slate-500">Occupancy</div>
               </div>
             </div>
             
             <div className="p-6">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Zones Summary</h4>
               <div className="space-y-4">
                 {wh.zones.map(zone => (
                   <div key={zone.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {zone.type === 'rack' ? <Grid className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-slate-700">{zone.name}</span>
                          <span className="text-xs text-slate-400 font-mono">{zone.code}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-500 w-3/4 rounded-full"></div>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{zone.bins_count} Bins</div>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  const renderLayout = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
           <h3 className="text-xl font-bold flex items-center gap-2"><Map className="w-6 h-6" /> Zone Editor</h3>
           <p className="text-slate-400 text-sm">Configure storage zones and bin capacities.</p>
        </div>
        <button 
          onClick={() => setIsAddZoneModalOpen(true)}
          className="px-4 py-2 bg-brand-600 rounded-lg font-bold hover:bg-brand-500 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Zone
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {warehouses[0].zones.map(zone => (
           <div key={zone.id} className="bg-white border border-slate-200 rounded-xl p-6 relative group hover:border-brand-300 transition-all">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-sm font-bold text-brand-600 hover:underline">Edit Zone</button>
             </div>
             <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900">{zone.name}</h4>
                   <p className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{zone.code}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                   <div className="text-xs text-slate-500 mb-1">Type</div>
                   <div className="font-bold capitalize">{zone.type} Storage</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                   <div className="text-xs text-slate-500 mb-1">Capacity</div>
                   <div className="font-bold">{zone.bins_count} Bins</div>
                </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );

  const renderBatches = () => (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">Active Batches</h3>
          <button 
            onClick={() => setIsReceiving(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-brand-500"
          >
            <Plus className="w-4 h-4" /> Receive Batch
          </button>
       </div>

       {/* Batch Receiving Form */}
       {isReceiving && (
         <div className="bg-white p-6 rounded-xl border border-brand-200 shadow-sm mb-6 animate-in slide-in-from-top-2">
            <h4 className="font-bold mb-4">Receive New Inventory</h4>
            <form onSubmit={handleReceiveBatch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Item</label>
                 <select 
                   className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                   value={newItemBatch.itemId}
                   onChange={e => setNewItemBatch({...newItemBatch, itemId: e.target.value})}
                   required
                 >
                   <option value="">Select Item</option>
                   {MOCK_ITEMS.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Batch #</label>
                 <input 
                   type="text" 
                   className="w-full p-2 border border-slate-200 rounded-lg text-sm" 
                   placeholder="e.g. B-123"
                   value={newItemBatch.batchNo}
                   onChange={e => setNewItemBatch({...newItemBatch, batchNo: e.target.value})}
                   required
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Quantity</label>
                 <input 
                    type="number" 
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm" 
                    placeholder="0"
                    value={newItemBatch.qty}
                    onChange={e => setNewItemBatch({...newItemBatch, qty: e.target.value})}
                    required
                 />
               </div>
               <div className="flex gap-2">
                 <button type="button" onClick={() => setIsReceiving(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-600">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-brand-600 rounded-lg text-sm font-bold text-white flex-1">Save</button>
               </div>
            </form>
         </div>
       )}

       {/* Batch List */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-sm text-left">
           <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
             <tr>
               <th className="p-4">Batch Number</th>
               <th className="p-4">Item</th>
               <th className="p-4">Received</th>
               <th className="p-4">Available</th>
               <th className="p-4">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {batches.map(batch => (
               <tr key={batch.id} className="hover:bg-slate-50">
                 <td className="p-4 font-mono text-slate-600">{batch.batch_number}</td>
                 <td className="p-4 font-medium text-slate-900">
                    {MOCK_ITEMS.find(i => i.id === batch.item_id)?.title || 'Unknown Item'}
                 </td>
                 <td className="p-4 flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-slate-400" />
                   {new Date(batch.received_date).toLocaleDateString()}
                 </td>
                 <td className="p-4">
                   <span className="font-bold">{batch.quantity_available}</span> / {batch.quantity_received}
                 </td>
                 <td className="p-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${batch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {batch.status}
                   </span>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );

  const renderMovements = () => (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">Stock Movements</h3>
          <button 
            onClick={() => setIsMoving(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-slate-700"
          >
            <ArrowRightLeft className="w-4 h-4" /> Move Stock
          </button>
       </div>

       {/* Move Stock Form */}
       {isMoving && (
         <div className="bg-white p-6 rounded-xl border border-brand-200 shadow-sm mb-6 animate-in slide-in-from-top-2">
            <h4 className="font-bold mb-4">Transfer Stock</h4>
            <form onSubmit={handleMoveStock} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
               <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-slate-500 mb-1">Item</label>
                 <select 
                   className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                   value={newMovement.itemId}
                   onChange={e => setNewMovement({...newMovement, itemId: e.target.value})}
                   required
                 >
                   <option value="">Select Item</option>
                   {MOCK_ITEMS.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">From</label>
                 <select 
                   className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                   value={newMovement.from}
                   onChange={e => setNewMovement({...newMovement, from: e.target.value})}
                   required
                 >
                   <option value="">Location</option>
                   {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">To</label>
                 <select 
                   className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                   value={newMovement.to}
                   onChange={e => setNewMovement({...newMovement, to: e.target.value})}
                   required
                 >
                   <option value="">Location</option>
                   {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Qty</label>
                 <input 
                   type="number" 
                   className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                   value={newMovement.qty}
                   onChange={e => setNewMovement({...newMovement, qty: e.target.value})}
                   required 
                 />
               </div>
               <div className="md:col-span-5 flex justify-end gap-2 mt-2">
                 <button type="button" onClick={() => setIsMoving(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-600">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-slate-900 rounded-lg text-sm font-bold text-white">Transfer</button>
               </div>
            </form>
         </div>
       )}

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         {movements.map(mov => (
           <div key={mov.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className={`p-2 rounded-lg ${mov.movement_type === 'inbound' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                   {mov.movement_type === 'inbound' ? <Truck className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900 flex items-center gap-2">
                     {MOCK_ITEMS.find(i => i.id === mov.item_id)?.title}
                     <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">{mov.movement_type}</span>
                   </h4>
                   <p className="text-xs text-slate-500 mt-1">
                     {new Date(mov.created_at).toLocaleString()} • {mov.notes}
                   </p>
                 </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">
                  {mov.movement_type === 'outbound' ? '-' : '+'}{mov.quantity}
                </div>
                <div className="text-xs text-slate-500">Units</div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       
       {/* Sub-Navigation */}
       <div className="flex border-b border-slate-200 gap-6">
         <button 
           onClick={() => setActiveTab('overview')}
           className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'overview' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
         >
           Overview
         </button>
         <button 
           onClick={() => setActiveTab('layout')}
           className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'layout' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
         >
           Layout Management
         </button>
         <button 
           onClick={() => setActiveTab('batches')}
           className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'batches' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
         >
           Batch Manager
         </button>
         <button 
           onClick={() => setActiveTab('movements')}
           className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'movements' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
         >
           Stock Handling
         </button>
       </div>

       {/* Tab Content */}
       <div className="min-h-[400px]">
         {activeTab === 'overview' && renderOverview()}
         {activeTab === 'layout' && renderLayout()}
         {activeTab === 'batches' && renderBatches()}
         {activeTab === 'movements' && renderMovements()}
       </div>

       {/* Add Zone Modal */}
       {isAddZoneModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddZoneModalOpen(false)}></div>
           <div className="bg-white rounded-2xl w-full max-w-md relative z-10 p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-900">Create New Zone</h3>
               <button onClick={() => setIsAddZoneModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X className="w-6 h-6" />
               </button>
             </div>
             
             <form onSubmit={handleCreateZone} className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Zone Name</label>
                 <input 
                   type="text" 
                   value={newZone.name}
                   onChange={e => setNewZone({...newZone, name: e.target.value})}
                   placeholder="e.g. Cold Storage A"
                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Zone Code</label>
                 <input 
                   type="text" 
                   value={newZone.code}
                   onChange={e => setNewZone({...newZone, code: e.target.value})}
                   placeholder="e.g. Z-COLD-A"
                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl uppercase"
                   required
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                   <select 
                     value={newZone.type}
                     onChange={e => setNewZone({...newZone, type: e.target.value as any})}
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                   >
                     <option value="rack">Rack</option>
                     <option value="bulk">Bulk</option>
                     <option value="bin">Bin</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Capacity (Bins)</label>
                   <input 
                     type="number" 
                     value={newZone.bins}
                     onChange={e => setNewZone({...newZone, bins: Number(e.target.value)})}
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                     min="1"
                   />
                 </div>
               </div>
               <button type="submit" className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors mt-2 flex items-center justify-center gap-2">
                 <Check className="w-5 h-5" /> Create Zone
               </button>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};