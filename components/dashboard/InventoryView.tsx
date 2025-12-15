
import React, { useState } from 'react';
import { Item, StockAudit, InventoryMovement, StockAuditItem } from '../../types';
import { 
  Search, Edit2, Trash2, Package, Download, FileText, 
  AlertTriangle, Filter, CheckSquare, Square, MoreHorizontal, X, Loader2,
  History, ClipboardCheck, ArrowUpRight, ArrowDownLeft, RefreshCw, Save,
  Plus, Calendar
} from 'lucide-react';
import { generateInventoryReport } from '../../services/geminiService';
import { MOCK_AUDITS, MOCK_MOVEMENTS } from '../../constants';

interface InventoryViewProps {
  items: Item[];
}

export const InventoryView: React.FC<InventoryViewProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeTab, setActiveTab] = useState<'products' | 'audit' | 'history'>('products');
  
  // -- Products Tab State --
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'low_stock'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // -- Audit Tab State --
  const [audits, setAudits] = useState<StockAudit[]>(MOCK_AUDITS);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [currentAudit, setCurrentAudit] = useState<Partial<StockAudit> | null>(null);

  // -- History Tab State --
  const [movements, setMovements] = useState<InventoryMovement[]>(MOCK_MOVEMENTS);

  // -- Adjustment Modal State --
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<Item | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Manual Correction');

  // -- AI Report State --
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // --- FILTERS ---
  const filteredItems = items.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.includes(searchTerm);
    if (!matchesSearch) return false;
    if (statusFilter === 'active') return i.status === 'public';
    if (statusFilter === 'draft') return i.status === 'draft';
    if (statusFilter === 'low_stock') return i.quantity < 5;
    return true;
  });

  // --- ACTIONS ---

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;
    
    // Update local Item state
    const updatedItems = items.map(i => {
      if (i.id === adjustItem.id) {
        return { ...i, quantity: i.quantity + adjustQty };
      }
      return i;
    });
    setItems(updatedItems);

    // Log Movement
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      item_id: adjustItem.id,
      user_id: 'current-user',
      movement_type: adjustQty >= 0 ? 'adjustment' : 'adjustment', // could differentiate write-off
      quantity: Math.abs(adjustQty),
      created_at: new Date().toISOString(),
      notes: `${adjustReason} (${adjustQty > 0 ? '+' : ''}${adjustQty})`
    };
    setMovements([newMovement, ...movements]);

    setIsAdjustModalOpen(false);
    setAdjustItem(null);
    setAdjustQty(0);
  };

  const handleStartAudit = () => {
    const newAudit: Partial<StockAudit> = {
      id: `audit-${Date.now()}`,
      reference_number: `INV-${new Date().getFullYear()}-${String(audits.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      status: 'in_progress',
      items: items.map(i => ({
        item_id: i.id,
        expected_qty: i.quantity,
        actual_qty: null, // To be filled
        discrepancy: 0
      })),
      notes: ''
    };
    setCurrentAudit(newAudit);
    setIsAuditModalOpen(true);
  };

  const handleAuditUpdateItem = (itemId: string, actual: number) => {
    if (!currentAudit || !currentAudit.items) return;
    
    const updatedItems = currentAudit.items.map(ai => {
      if (ai.item_id === itemId) {
        return {
          ...ai,
          actual_qty: actual,
          discrepancy: actual - ai.expected_qty
        };
      }
      return ai;
    });
    
    setCurrentAudit({ ...currentAudit, items: updatedItems });
  };

  const handleFinalizeAudit = () => {
    if (!currentAudit) return;
    
    const finalizedAudit: StockAudit = {
      ...currentAudit as StockAudit,
      status: 'completed',
      completed_at: new Date().toISOString()
    };
    
    setAudits([finalizedAudit, ...audits]);
    
    // Apply changes to stock
    const newMovements: InventoryMovement[] = [];
    const updatedItems = [...items];

    finalizedAudit.items.forEach(auditItem => {
      if (auditItem.discrepancy !== 0 && auditItem.actual_qty !== null) {
        // Find and update item
        const idx = updatedItems.findIndex(i => i.id === auditItem.item_id);
        if (idx > -1) {
          updatedItems[idx] = { ...updatedItems[idx], quantity: auditItem.actual_qty };
        }

        // Log movement
        newMovements.push({
          id: `mov-audit-${Date.now()}-${auditItem.item_id}`,
          item_id: auditItem.item_id,
          user_id: 'current-user',
          movement_type: 'audit_correction',
          quantity: Math.abs(auditItem.discrepancy),
          created_at: new Date().toISOString(),
          notes: `Audit ${finalizedAudit.reference_number}: Correction`
        });
      }
    });

    setItems(updatedItems);
    setMovements([...newMovements, ...movements]);
    setIsAuditModalOpen(false);
    setCurrentAudit(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'SKU', 'Price', 'Quantity', 'Status', 'Created At'];
    const rows = filteredItems.map(i => [
      i.id, 
      `"${i.title.replace(/"/g, '""')}"`, 
      i.sku || '', 
      i.price, 
      i.quantity, 
      i.status, 
      i.created_at
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async () => {
    setIsReportOpen(true);
    if (!reportText) {
      setIsGeneratingReport(true);
      const text = await generateInventoryReport(filteredItems);
      setReportText(text);
      setIsGeneratingReport(false);
    }
  };

  // --- RENDER FUNCTIONS ---

  const renderProductsTab = () => (
    <>
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-slate-50/50">
         <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
           <div className="relative flex-1 sm:w-80">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search inventory..." 
               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="active">Active</option>
                <option value="draft">Drafts</option>
                <option value="low_stock">Low Stock</option>
              </select>
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
           </div>
         </div>
         <div className="flex items-center gap-2">
           <button onClick={handleGenerateReport} className="px-3 py-2 bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
             <FileText className="w-4 h-4" /> AI Report
           </button>
           <button onClick={handleExportCSV} className="px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
             <Download className="w-4 h-4" /> Export CSV
           </button>
         </div>
      </div>

      {/* Product Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider">
             <tr>
               <th className="p-4 w-12 border-b border-slate-200"><Square className="w-5 h-5 text-slate-300" /></th>
               <th className="p-4 border-b border-slate-200">Item</th>
               <th className="p-4 border-b border-slate-200">SKU</th>
               <th className="p-4 border-b border-slate-200">Status</th>
               <th className="p-4 border-b border-slate-200 text-center">In Stock</th>
               <th className="p-4 border-b border-slate-200 text-right">Value</th>
               <th className="p-4 border-b border-slate-200 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => {
              const isLowStock = item.quantity < 5;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                   <td className="p-4"><Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400 cursor-pointer" /></td>
                   <td className="p-4">
                     <div className="flex items-center gap-3">
                       <img src={item.images[0]} className="w-10 h-10 rounded-lg object-cover bg-slate-100" alt=""/>
                       <span className="font-medium text-slate-900 line-clamp-1 max-w-[200px]">{item.title}</span>
                     </div>
                   </td>
                   <td className="p-4 text-sm font-mono text-slate-500">{item.sku || '—'}</td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.status === 'public' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                       {item.status === 'public' ? 'Active' : item.status}
                     </span>
                   </td>
                   <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>{item.quantity}</span>
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                   </td>
                   <td className="p-4 text-right font-mono text-sm">
                      {new Intl.NumberFormat('ru-RU').format(item.price || 0)} ₽
                   </td>
                   <td className="p-4 text-right">
                      <button 
                        onClick={() => { setAdjustItem(item); setIsAdjustModalOpen(true); }}
                        className="text-brand-600 hover:text-brand-800 text-xs font-bold px-3 py-1 bg-brand-50 rounded hover:bg-brand-100 transition-colors"
                      >
                        Adjust
                      </button>
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAuditTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
         <div>
           <h2 className="text-xl font-bold text-slate-900">Stock Audits</h2>
           <p className="text-sm text-slate-500">Reconcile physical inventory with system records.</p>
         </div>
         <button 
           onClick={handleStartAudit}
           className="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-500 shadow-lg shadow-brand-500/20 flex items-center gap-2"
         >
           <Plus className="w-4 h-4" /> New Count
         </button>
      </div>
      
      <div className="p-6 grid gap-4">
        {audits.map(audit => (
          <div key={audit.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-brand-300 transition-colors">
             <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${audit.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                 <ClipboardCheck className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="font-bold text-slate-900">{audit.reference_number}</h4>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                   <Calendar className="w-3.5 h-3.5" /> {new Date(audit.created_at).toLocaleDateString()}
                   <span>•</span>
                   <span>{audit.items.length} Items</span>
                 </div>
               </div>
             </div>
             <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${audit.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {audit.status.replace('_', ' ')}
                </span>
                {audit.completed_at && (
                  <p className="text-xs text-slate-400 mt-1">Completed {new Date(audit.completed_at).toLocaleDateString()}</p>
                )}
             </div>
          </div>
        ))}
        {audits.length === 0 && (
          <div className="text-center py-12 text-slate-400">
             <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
             <p>No audits found. Start a new stock count to verify inventory.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-900">Movement History</h2>
        <p className="text-sm text-slate-500">Track all stock changes, transfers, and adjustments.</p>
      </div>
      <div className="flex-1 overflow-auto">
         <table className="w-full text-left">
           <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
             <tr>
               <th className="p-4">Date</th>
               <th className="p-4">Type</th>
               <th className="p-4">Item</th>
               <th className="p-4 text-right">Change</th>
               <th className="p-4">Reason</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {movements.map(mov => {
               const item = items.find(i => i.id === mov.item_id);
               return (
                 <tr key={mov.id} className="hover:bg-slate-50 text-sm">
                   <td className="p-4 text-slate-500">{new Date(mov.created_at).toLocaleString()}</td>
                   <td className="p-4">
                     <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase 
                       ${mov.movement_type === 'inbound' ? 'bg-green-100 text-green-700' : 
                         mov.movement_type === 'outbound' ? 'bg-red-100 text-red-700' : 
                         'bg-blue-100 text-blue-700'}`}>
                       {mov.movement_type}
                     </span>
                   </td>
                   <td className="p-4 font-medium text-slate-900">{item?.title || 'Unknown Item'}</td>
                   <td className={`p-4 text-right font-bold ${mov.quantity > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                     {mov.movement_type === 'outbound' ? '-' : '+'}{mov.quantity}
                   </td>
                   <td className="p-4 text-slate-500 italic">{mov.notes || '-'}</td>
                 </tr>
               )
             })}
           </tbody>
         </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-[calc(100vh-140px)]">
      
      {/* --- Main Navigation Tabs --- */}
      <div className="flex border-b border-slate-200 px-6 pt-4 gap-6 bg-white">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'products' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Package className="w-4 h-4" /> Products
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'audit' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <ClipboardCheck className="w-4 h-4" /> Stock Audit (Inventory)
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <History className="w-4 h-4" /> History
        </button>
      </div>

      {activeTab === 'products' && renderProductsTab()}
      {activeTab === 'audit' && renderAuditTab()}
      {activeTab === 'history' && renderHistoryTab()}

      {/* --- Adjust Stock Modal --- */}
      {isAdjustModalOpen && adjustItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdjustModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-lg font-bold mb-4">Quick Stock Adjustment</h3>
             <p className="text-sm text-slate-500 mb-6">Adjusting inventory for <strong>{adjustItem.title}</strong></p>
             
             <form onSubmit={handleStockAdjustment} className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Quantity Change</label>
                 <div className="flex items-center gap-2">
                   <button type="button" onClick={() => setAdjustQty(q => q - 1)} className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200 font-bold">-</button>
                   <input 
                     type="number" 
                     className="flex-1 p-3 border border-slate-200 rounded-lg text-center font-bold"
                     value={adjustQty}
                     onChange={e => setAdjustQty(Number(e.target.value))}
                   />
                   <button type="button" onClick={() => setAdjustQty(q => q + 1)} className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200 font-bold">+</button>
                 </div>
                 <p className="text-xs text-slate-400 mt-1">Current Stock: {adjustItem.quantity} → New Stock: {adjustItem.quantity + adjustQty}</p>
               </div>
               
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Reason</label>
                 <select 
                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                   value={adjustReason}
                   onChange={e => setAdjustReason(e.target.value)}
                 >
                   <option>Manual Correction</option>
                   <option>Damaged / Write-off</option>
                   <option>Found Inventory</option>
                   <option>Gift / Promo</option>
                 </select>
               </div>

               <div className="flex gap-2 pt-2">
                 <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                 <button type="submit" className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">Save Adjustment</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* --- Audit Editor Modal --- */}
      {isAuditModalOpen && currentAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAuditModalOpen(false)}></div>
           <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95">
             <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Inventory Count: {currentAudit.reference_number}</h2>
                  <p className="text-sm text-slate-500">Enter actual quantities found in warehouse.</p>
                </div>
                <button onClick={() => setIsAuditModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5"/></button>
             </div>
             
             <div className="flex-1 overflow-auto p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 text-xs font-bold text-slate-500 uppercase">
                      <th className="p-3">Item</th>
                      <th className="p-3 text-center">System Qty</th>
                      <th className="p-3 text-center w-32">Actual Qty</th>
                      <th className="p-3 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentAudit.items?.map(ai => {
                      const item = items.find(i => i.id === ai.item_id);
                      const hasDiscrepancy = ai.discrepancy !== 0 && ai.actual_qty !== null;
                      return (
                        <tr key={ai.item_id} className={hasDiscrepancy ? 'bg-red-50' : 'hover:bg-slate-50'}>
                           <td className="p-3 font-medium text-slate-900">{item?.title}</td>
                           <td className="p-3 text-center text-slate-500">{ai.expected_qty}</td>
                           <td className="p-3">
                             <input 
                               type="number" 
                               className="w-full p-2 border border-slate-300 rounded text-center font-bold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                               placeholder="-"
                               value={ai.actual_qty ?? ''}
                               onChange={(e) => handleAuditUpdateItem(ai.item_id, parseInt(e.target.value) || 0)}
                             />
                           </td>
                           <td className={`p-3 text-right font-bold ${hasDiscrepancy ? 'text-red-600' : 'text-slate-300'}`}>
                             {ai.actual_qty !== null ? (ai.discrepancy > 0 ? `+${ai.discrepancy}` : ai.discrepancy) : '—'}
                           </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
             </div>

             <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
               <button onClick={() => setIsAuditModalOpen(false)} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-white rounded-lg transition-colors">Save Draft</button>
               <button onClick={handleFinalizeAudit} className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-500 shadow-lg shadow-brand-500/20 flex items-center gap-2">
                 <CheckSquare className="w-4 h-4" /> Finalize Count
               </button>
             </div>
           </div>
        </div>
      )}

      {/* --- AI Report Modal (Reused) --- */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsReportOpen(false)}></div>
           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-brand-600" /> Inventory Intelligence
                 </h3>
                 <button onClick={() => setIsReportOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                 {isGeneratingReport ? (
                   <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-4">
                      <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                      <p>Analyzing inventory data...</p>
                   </div>
                 ) : (
                   <div className="prose prose-slate max-w-none prose-sm whitespace-pre-wrap">{reportText}</div>
                 )}
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end">
                <button onClick={() => setIsReportOpen(false)} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg">Close</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
