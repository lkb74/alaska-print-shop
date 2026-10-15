
import React, { useState, useMemo } from 'react';

export default function PrintOrderQuotePage() {
  const [printMethod, setPrintMethod] = useState<'DIGITAL' | 'OFFSET'>('DIGITAL');
  const [size, setSize] = useState('A4');
  const [binding, setBinding] = useState<'PERFECT' | 'SADDLE' | 'RING'>('PERFECT');
  const [coverPaper, setCoverPaper] = useState({ name: '스노우 250g', cost: 140 });
  const [innerPaper, setInnerPaper] = useState({ name: '스노우 100g', cost: 50 });
  const [pages, setPages] = useState(40);
  const [quantity, setQuantity] = useState(50);
  const [coating, setCoating] = useState<'NONE' | 'MATTE' | 'GLOSS'>('MATTE');
  const [hasFoil, setHasFoil] = useState(false);
  const [uploadLater, setUploadLater] = useState(false);

  const quote = useMemo(() => {
    const imposition = size === 'A4' ? 4 : 8;
    const coverSheets = Math.ceil((quantity * 4) / imposition);
    const innerSheets = Math.ceil((quantity * pages) / imposition);
    const loss = printMethod === 'OFFSET' ? 120 : 4;

    const paperCost = (coverSheets + loss) * coverPaper.cost + (innerSheets + loss) * innerPaper.cost;
    
    const volumeDiscount = quantity >= 100 ? 0.75 : quantity >= 30 ? 0.85 : 1.0;
    const printCost = printMethod === 'DIGITAL'
      ? (coverSheets + innerSheets * 2) * 140 * volumeDiscount
      : Math.ceil((pages + 4) / 16) * 65000;

    const bindingBase = binding === 'PERFECT' ? 380 : binding === 'SADDLE' ? 150 : 750;
    const bindingCost = Math.max(15000, quantity * bindingBase + (pages * 2 * quantity));

    let postCost = 0;
    if (coating !== 'NONE') postCost += Math.max(5000, quantity * 90);
    if (hasFoil) postCost += 30000 + (quantity * 120);

    const supplyPrice = Math.floor((paperCost + printCost + bindingCost + postCost) / 100) * 100;
    const vat = Math.floor(supplyPrice * 0.1);

    return {
      paperCost: Math.round(paperCost),
      printCost: Math.round(printCost),
      bindingCost: Math.round(bindingCost),
      postCost: Math.round(postCost),
      supplyPrice,
      vat,
      totalPrice: supplyPrice + vat,
      unitPrice: Math.round(supplyPrice / quantity)
    };
  }, [printMethod, size, binding, coverPaper, innerPaper, pages, quantity, coating, hasFoil]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-black tracking-tight text-indigo-700">ALASKA PRINT SI</h1>
            <nav className="hidden md:flex space-x-6 text-sm font-semibold text-slate-700">
              <a href="#digital" className="text-indigo-600 border-b-2 border-indigo-600 py-5">디지털 인쇄 (소량/당일)</a>
              <a href="#offset" className="hover:text-indigo-600 py-5">옵셋/합판 인쇄 (대량)</a>
              <a href="#sticker" className="hover:text-indigo-600 py-5">스티커/실사</a>
              <a href="#curation" className="hover:text-indigo-600 py-5">업종별 패키지</a>
              <a href="#guide" className="hover:text-indigo-600 py-5">인쇄 작업가이드</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
              오늘 당일출고 마감: 16:00
            </span>
            <button className="text-slate-600 hover:text-slate-900">마이페이지 (접수/검수조회)</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">BOOKLET & CATALOG</span>
                <h2 className="text-2xl font-bold mt-1">카탈로그 / 책자 실시간 자동견적</h2>
              </div>
              <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium">
                칼선 가이드(AI/PDF) 다운로드
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">1. 인쇄 방식</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPrintMethod('DIGITAL')}
                    className={`p-3 rounded-lg border text-left transition ${
                      printMethod === 'DIGITAL' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold' : 'border-slate-200'
                    }`}
                  >
                    <div className="text-sm">디지털 인쇄</div>
                    <div className="text-[11px] text-slate-500 font-normal">1~200부 소량 / 당일·익일 출고</div>
                  </button>
                  <button
                    onClick={() => { setPrintMethod('OFFSET'); if (quantity < 300) setQuantity(500); }}
                    className={`p-3 rounded-lg border text-left transition ${
                      printMethod === 'OFFSET' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold' : 'border-slate-200'
                    }`}
                  >
                    <div className="text-sm">옵셋 인쇄</div>
                    <div className="text-[11px] text-slate-500 font-normal">300부 이상 대량 / 단가 대폭 절감</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">2. 제본 방식</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'PERFECT', label: '무선제본', desc: '책등 본드 제본' },
                    { code: 'SADDLE', label: '중철제본', desc: '스테이플러 심' },
                    { code: 'RING', label: '스프링제본', desc: '트윈링 타공' }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => setBinding(item.code as any)}
                      className={`p-3 rounded-lg border text-center transition ${
                        binding === item.code ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold' : 'border-slate-200'
                      }`}
                    >
                      <div className="text-sm">{item.label}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">3. 완성 규격 (재단 사이즈)</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium"
                >
                  <option value="A4">A4 (210 × 297mm)</option>
                  <option value="B5">B5 / 16절 (182 × 257mm)</option>
                  <option value="A5">A5 / 국반절 (148 × 210mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">4. 내지 페이지 수 (표지 4p 별도)</label>
                <input
                  type="number"
                  step={4}
                  min={8}
                  max={500}
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">5. 제작 수량 (부수)</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full border border-indigo-400 bg-indigo-50/20 rounded-lg p-2.5 text-sm font-bold text-indigo-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">6. 표지 용지 및 코팅 (필수 권장)</label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'SNOW250') setCoverPaper({ name: '스노우 250g', cost: 140 });
                      if (val === 'RENDEZVOUS240') setCoverPaper({ name: '랑데뷰 240g (고급지)', cost: 290 });
                    }}
                    className="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="SNOW250">일반지 - 스노우화이트 250g</option>
                    <option value="RENDEZVOUS240">고급지 - 랑데뷰 내츄럴 240g</option>
                  </select>
                  <select
                    value={coating}
                    onChange={(e) => setCoating(e.target.value as any)}
                    className="w-36 border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="MATTE">단면 무광코팅</option>
                    <option value="GLOSS">단면 유광코팅</option>
                    <option value="NONE">코팅 없음</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">7. 내지 용지 및 특수 후가공</label>
                <div className="flex items-center gap-3">
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'SNOW100') setInnerPaper({ name: '스노우 100g', cost: 50 });
                      if (val === 'MOJO100') setInnerPaper({ name: '백색모조 100g', cost: 55 });
                    }}
                    className="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="SNOW100">스노우화이트 100g (양면 칼라 8도)</option>
                    <option value="MOJO100">백색모조지 100g (필기감 우수)</option>
                  </select>
                  <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer bg-slate-100 px-3 py-2.5 rounded-lg">
                    <input
                      type="checkbox"
                      checked={hasFoil}
                      onChange={(e) => setHasFoil(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>표지 금박/은박 추가</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">원고 파일 접수 (PDF 권장)</h3>
              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uploadLater}
                  onChange={(e) => setUploadLater(e.target.checked)}
                />
                <span>선결제 후 마이페이지에서 추후 파일 업로드</span>
              </label>
            </div>

            {!uploadLater && (
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl p-6 text-center">
                <p className="text-sm font-semibold text-indigo-950">
                  인쇄용 PDF 또는 작업 파일(AI, INDD 압축)을 이곳에 드래그하거나 선택하세요.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  • 사방 여백(도련) 3mm 필수 포함 | • 모든 서체 윤곽선(Outline) 처리 | • CMYK 색상 모드 준수
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold border-b border-slate-200 pb-3 mb-4">실시간 견적 명세서</h3>
            
            <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span>인쇄 / 제본</span>
                <span className="font-semibold text-slate-900">
                  {printMethod === 'DIGITAL' ? '디지털 급행' : '옵셋 대량'} / {binding === 'PERFECT' ? '무선제본' : binding === 'SADDLE' ? '중철제본' : '스프링'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>규격 / 수량</span>
                <span className="font-semibold text-slate-900">{size} / 총 {pages + 4}P × {quantity}부</span>
              </div>
              <div className="flex justify-between">
                <span>표지 / 내지</span>
                <span className="font-semibold text-slate-900">{coverPaper.name} / {innerPaper.name}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-lg mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">• 용지 지대 (표지+내지)</span>
                <span className="font-medium">{quote.paperCost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">• 인쇄 및 출력비</span>
                <span className="font-medium">{quote.printCost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">• 제본 공정비</span>
                <span className="font-medium">{quote.bindingCost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">• 후가공비 (코팅/박 등)</span>
                <span className="font-medium">{quote.postCost.toLocaleString()}원</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>공급가액: {quote.supplyPrice.toLocaleString()}원</span>
                <span>부가세(10%): {quote.vat.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-sm font-bold text-slate-800">총 결제금액</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600">
                    {quote.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-indigo-600 ml-0.5">원</span>
                  <div className="text-[11px] text-slate-400">
                    (1부당 약 {quote.unitPrice.toLocaleString()}원)
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-sm transition">
                바로 주문하기 (파일 접수)
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-xs">
                  장바구니 담기
                </button>
                <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-xs">
                  공식 견적서 출력
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
