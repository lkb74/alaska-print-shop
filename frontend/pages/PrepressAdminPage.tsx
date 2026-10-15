import React, { useState } from 'react';

interface OrderItem {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  isUrgent: boolean;
  productName: string;
  printMethod: 'DIGITAL' | 'OFFSET';
  status: 'PREFLIGHT_CHECK' | 'FILE_REJECTED' | 'IMPOSITION_READY' | 'PRINTING';
  spec: {
    sizeName: string;
    cutWidth: number;
    cutHeight: number;
    workWidth: number;
    workHeight: number;
    binding: string;
    quantity: number;
    pages: number;
    coverPaper: string;
    coverGrammage: number;
    coverColor: string;
    innerPaper: string;
    innerGrammage: number;
    innerColor: string;
    postProcesses: string[];
    impositionCount: number;
    lossSheets: number;
  };
  preflight: {
    fileName: string;
    fileSizeMb: number;
    detectedPages: number;
    detectedWidth: number;
    detectedHeight: number;
    hasBleed: boolean;
    colorSpace: 'CMYK' | 'RGB_MIXED';
    fontsOutlined: boolean;
    minDpi: number;
  };
  rejectReason?: string;
  adminMemo?: string;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    orderId: 'ORD-20261015-0891',
    orderDate: '2026-10-15 09:12',
    customerName: '(주)디자인스튜디오봄',
    customerPhone: '010-4821-9901',
    isUrgent: true,
    productName: '무선제본 카탈로그',
    printMethod: 'DIGITAL',
    status: 'PREFLIGHT_CHECK',
    spec: {
      sizeName: 'A4 (210×297mm)',
      cutWidth: 210,
      cutHeight: 297,
      workWidth: 216,
      workHeight: 303,
      binding: '무선제본 (좌철)',
      quantity: 100,
      pages: 48,
      coverPaper: '스노우화이트',
      coverGrammage: 250,
      coverColor: '단면칼라 4도',
      innerPaper: '스노우화이트',
      innerGrammage: 100,
      innerColor: '양면칼라 8도',
      postProcesses: ['표지 단면 무광코팅', '표지 오시 2줄(책등)'],
      impositionCount: 4,
      lossSheets: 10,
    },
    preflight: {
      fileName: '2026_가을신제품_카탈로그_최종.pdf',
      fileSizeMb: 142.5,
      detectedPages: 52,
      detectedWidth: 210,
      detectedHeight: 297,
      hasBleed: false,
      colorSpace: 'RGB_MIXED',
      fontsOutlined: true,
      minDpi: 300,
    },
  },
  {
    orderId: 'ORD-20261015-0892',
    orderDate: '2026-10-15 09:25',
    customerName: '서울미래교육원',
    customerPhone: '010-8812-3345',
    isUrgent: false,
    productName: '옵셋 대량 홍보 브로슈어',
    printMethod: 'OFFSET',
    status: 'IMPOSITION_READY',
    spec: {
      sizeName: 'B5 / 16절 (182×257mm)',
      cutWidth: 182,
      cutHeight: 257,
      workWidth: 188,
      workHeight: 263,
      binding: '무선제본 (좌철)',
      quantity: 1000,
      pages: 64,
      coverPaper: '랑데뷰 내츄럴',
      coverGrammage: 240,
      coverColor: '양면칼라 8도',
      innerPaper: '백색모조지',
      innerGrammage: 100,
      innerColor: '양면칼라 8도',
      postProcesses: ['표지 유광금박 (90×40mm)', '표지 오시 4줄'],
      impositionCount: 16,
      lossSheets: 150,
    },
    preflight: {
      fileName: '미래교육원_정기교재_인쇄용.pdf',
      fileSizeMb: 318.0,
      detectedPages: 68,
      detectedWidth: 188,
      detectedHeight: 263,
      hasBleed: true,
      colorSpace: 'CMYK',
      fontsOutlined: true,
      minDpi: 350,
    },
  },
];

const REJECT_TEMPLATES = [
  '재단 여백(도련 3mm) 누락: 작업 사이즈로 여백을 늘려 다시 저장해 주세요.',
  'RGB 색상 이미지 포함: 인쇄 시 색상 탁해짐(변색) 방지를 위해 전체 CMYK로 변환 요망',
  '서체(폰트) 미아웃라인: 유실된 서체가 있습니다. 모든 텍스트를 윤곽선(Create Outlines) 처리해 주세요.',
  '페이지 수 불일치: 주문하신 페이지 수(표지 포함)와 PDF 파일의 총 페이지 수가 다릅니다.',
  '해상도 부족(72~150dpi): 인쇄 시 깨짐 현상이 발생하므로 300dpi 이상 원본으로 교체 바랍니다.',
  '박/형압/오시 후가공 칼선 누락: 후가공 위치 데이터를 별도 레이어(K100%)로 표시해 주세요.',
];

export default function PrepressAdminPage() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0].orderId);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [rejectText, setRejectText] = useState<string>('');
  const [jobMemo, setJobMemo] = useState<string>('표지 베다(배경 진한 면) 인쇄 시 뒷묻음 주의 요망');
  const [showJobTicket, setShowJobTicket] = useState<boolean>(false);

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId) || orders[0];

  const calculateSpineWidth = (pages: number, grammage: number) => {
    const thicknessFactor = grammage >= 120 ? 0.00115 : 0.00125;
    return ((pages / 2) * (grammage * thicknessFactor)).toFixed(1);
  };

  const coverNetSheets = Math.ceil((selectedOrder.spec.quantity * 4) / selectedOrder.spec.impositionCount);
  const innerNetSheets = Math.ceil((selectedOrder.spec.quantity * selectedOrder.spec.pages) / selectedOrder.spec.impositionCount);

  const handleApprove = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === selectedOrder.orderId
          ? { ...o, status: 'IMPOSITION_READY', adminMemo: jobMemo }
          : o
      )
    );
    alert(`[승인 완료] ${selectedOrder.orderId} 건이 '조판/출력 대기' 상태로 전환되었습니다.`);
  };

  const handleReject = () => {
    if (!rejectText.trim()) {
      alert('반려(재접수 요청) 사유를 선택하거나 입력해 주세요.');
      return;
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === selectedOrder.orderId
          ? { ...o, status: 'FILE_REJECTED', rejectReason: rejectText }
          : o
      )
    );
    alert(`[알림톡 발송 완료]\n수신자: ${selectedOrder.customerName}\n사유: ${rejectText}`);
  };

  const addRejectTemplate = (template: string) => {
    setRejectText((prev) => (prev ? `${prev}\n• ${template}` : `• ${template}`));
  };

  const filteredOrders = orders.filter((o) =>
    filterStatus === 'ALL' ? true : o.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <header className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-4">
          <span className="bg-indigo-600 text-xs font-extrabold px-2.5 py-1 rounded">PREPRESS & MES</span>
          <h1 className="text-lg font-bold tracking-tight">인쇄 데이터 검수 및 현장 작업지시서 관리 시스템</h1>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1600px] w-full mx-auto p-6 gap-6 print:hidden">
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-sm">원고 접수 목록</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium"
            >
              <option value="ALL">전체 상태 보기</option>
              <option value="PREFLIGHT_CHECK">검수 대기중</option>
              <option value="FILE_REJECTED">데이터 반려</option>
              <option value="IMPOSITION_READY">검수 승인</option>
            </select>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredOrders.map((order) => {
              const isSelected = order.orderId === selectedOrder.orderId;
              return (
                <div
                  key={order.orderId}
                  onClick={() => {
                    setSelectedOrderId(order.orderId);
                    setRejectText(order.rejectReason || '');
                  }}
                  className={`p-4 cursor-pointer transition hover:bg-slate-50 ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900">{order.orderId}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">{order.productName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {order.customerName} | {order.spec.sizeName} | {order.spec.pages + 4}P × {order.spec.quantity}부
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">{selectedOrder.productName} ({selectedOrder.orderId})</h2>
              <p className="text-xs text-slate-500 mt-1">
                주문자: <strong>{selectedOrder.customerName}</strong> | 파일명: <strong>{selectedOrder.preflight.fileName}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setShowJobTicket(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition"
              >
                현장 작업지시서(Job Ticket) 출력
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-rose-200 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose-700 mb-2">데이터 반려 (고객 파일 재접수 요청)</h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {REJECT_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => addRejectTemplate(tpl)}
                      className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-2 py-1 rounded text-left"
                    >
                      + {tpl.split(':')[0]}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={rejectText}
                  onChange={(e) => setRejectText(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                />
              </div>
              <button
                onClick={handleReject}
                className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg text-xs"
              >
                파일 반려 처리 및 재업로드 알림톡 발송
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-200 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-emerald-800 mb-2">검수 승인 및 인쇄 공정 투입</h4>
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 mb-3 border border-slate-200">
                  <div className="flex justify-between">
                    <span>책등(세네카) 두께:</span>
                    <strong>약 {calculateSpineWidth(selectedOrder.spec.pages, selectedOrder.spec.innerGrammage)} mm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>표지 투입 원단 (정매+파지):</span>
                    <strong>{coverNetSheets + selectedOrder.spec.lossSheets} 매</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>내지 투입 원단 (정매+파지):</span>
                    <strong>{innerNetSheets + selectedOrder.spec.lossSheets} 매</strong>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={jobMemo}
                  onChange={(e) => setJobMemo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                />
              </div>
              <button
                onClick={handleApprove}
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs"
              >
                검수 최종 승인 (조판/출력 대기열로 전송)
              </button>
            </div>
          </div>
        </div>
      </div>

      {showJobTicket && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden print:shadow-none print:border-none">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
              <span className="text-sm font-bold">인쇄 공정 작업지시서 (Job Ticket) 미리보기</span>
              <div className="space-x-2">
                <button onClick={() => window.print()} className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded">
                  프린터 출력 (A4)
                </button>
                <button onClick={() => setShowJobTicket(false)} className="bg-slate-700 text-white text-xs px-3 py-1.5 rounded">
                  닫기
                </button>
              </div>
            </div>
            <div className="p-8 space-y-6 text-slate-900">
              <h2 className="text-3xl font-black">인쇄 작업지시서 ({selectedOrder.orderId})</h2>
              <p className="text-sm font-bold">품목: {selectedOrder.productName} / 수량: {selectedOrder.spec.quantity}부</p>
              <p className="text-sm">현장 메모: {jobMemo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
