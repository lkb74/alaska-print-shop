import React, { useState } from 'react';

interface PaperPriceRow {
  id: number;
  group: string;
  name: string;
  grammage: number;
  reamPrice: number;
  sheetUnitCost: number;
  lossRatePercent: number;
  updatedAt: string;
}

const INITIAL_PAPERS: PaperPriceRow[] = [
  { id: 1, group: '일반지', name: '스노우화이트', grammage: 100, reamPrice: 68000, sheetUnitCost: 50, lossRatePercent: 5, updatedAt: '2026-10-15' },
  { id: 2, group: '일반지', name: '스노우화이트', grammage: 250, reamPrice: 165000, sheetUnitCost: 140, lossRatePercent: 5, updatedAt: '2026-10-15' },
  { id: 3, group: '일반지', name: '백색모조지', grammage: 100, reamPrice: 72000, sheetUnitCost: 55, lossRatePercent: 5, updatedAt: '2026-10-15' },
  { id: 4, group: '고급수입지', name: '랑데뷰 내츄럴', grammage: 240, reamPrice: 320000, sheetUnitCost: 290, lossRatePercent: 8, updatedAt: '2026-10-15' },
];

export default function PricingMatrixAdminPage() {
  const [papers, setPapers] = useState<PaperPriceRow[]>(INITIAL_PAPERS);
  const [bulkPercent, setBulkPercent] = useState<number>(5);

  const handleBulkAdjustPaperPrice = (direction: 'UP' | 'DOWN') => {
    const factor = direction === 'UP' ? 1 + bulkPercent / 100 : 1 - bulkPercent / 100;
    setPapers((prev) =>
      prev.map((row) => ({
        ...row,
        reamPrice: Math.round((row.reamPrice * factor) / 100) * 100,
        sheetUnitCost: Math.round(row.sheetUnitCost * factor),
        updatedAt: new Date().toISOString().slice(0, 10),
      }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold">인쇄 원가 및 단가 조견표 통합 관리</h1>
          <div className="flex items-center space-x-2 text-xs">
            <input
              type="number"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(Number(e.target.value))}
              className="w-16 border rounded px-2 py-1 text-center font-bold"
            />
            <span>%</span>
            <button onClick={() => handleBulkAdjustPaperPrice('UP')} className="bg-rose-600 text-white px-3 py-1.5 rounded font-bold">
              일괄 인상
            </button>
            <button onClick={() => handleBulkAdjustPaperPrice('DOWN')} className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold">
              일괄 인하
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
