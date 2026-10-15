'use client';

import React, { useState } from 'react';
import { Search, ShoppingCart, User, Phone, FileText, Menu, X, ChevronRight, Printer, BookOpen, Layers, Award } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // 원본 사이트 카테고리 및 하위 메뉴 구조 완벽 반영
  const categoryMenus = [
    {
      title: "책자/카다로그",
      items: ["카탈로그", "무선제본책자", "중철제본책자", "링(와이어)제본책자", "보고서", "단행본(독립출판)", "학원교재", "1도/2도인쇄책자"]
    },
    {
      title: "리플렛/포스터",
      items: ["리플렛", "포스터", "대형포스터", "메뉴판"]
    },
    {
      title: "명함",
      items: ["일반지명함", "고급지명함", "특수지명함"]
    },
    {
      title: "스티커",
      items: ["낱장스티커", "롤스티커", "원형/사각스티커", "투명스티커"]
    },
    {
      title: "전단",
      items: ["일반전단지", "독판전단지", "자석전단지"]
    },
    {
      title: "상품권/초대장",
      items: ["상품권", "초대장", "티켓", "쿠폰", "엽서"]
    },
    {
      title: "봉투",
      items: ["대/중/소 규격봉투", "고급맞춤봉투", "상품권/티켓봉투", "초대장/청첩장봉투", "경조사봉투"]
    },
    {
      title: "양식지/NCR지",
      items: ["양식지", "거래명세서", "빌지", "NCR지"]
    },
    {
      title: "선거홍보물",
      items: ["선거공보 중철", "선거공보 3단접지", "선거벽보", "어깨띠"]
    }
  ];

  const bestProducts = [
    { title: "Catalog / 카탈로그", desc: "디지털 / 옵셋인쇄", tag: "BEST", category: "책자/카다로그" },
    { title: "Leaflet / 리플렛", desc: "디지털 / 옵셋인쇄", tag: "POPULAR", category: "리플렛/포스터" },
    { title: "Flyers / 전단지", desc: "디지털 / 옵셋인쇄", tag: "HOT", category: "전단" },
    { title: "Name Card / 명함", desc: "고급지 및 일반지 명함", tag: "RECOMMEND", category: "명함" },
    { title: "Stickers / 스티커", desc: "자유형태 낱장/롤 스티커", tag: "NEW", category: "스티커" },
    { title: "Envelope / 봉투", desc: "규격봉투 및 컬러봉투", tag: "BASIC", category: "봉투" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      
      {/* 1. Top Utility Bar */}
      <div className="bg-slate-100 border-b border-slate-200 text-xs text-slate-600 py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-900">고객센터: 02.2277.6777</span>
            <span className="hidden sm:inline text-slate-500">접수마감 : PM 6:30 / 토·일 휴무</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#login" className="hover:text-blue-900 font-medium">로그인</a>
            <span className="text-slate-300">|</span>
            <a href="#register" className="hover:text-blue-900 font-medium">회원가입</a>
            <span className="text-slate-300">|</span>
            <a href="#guide" className="hover:text-blue-900 font-medium">작업가이드</a>
            <span className="text-slate-300">|</span>
            <a href="#cs" className="hover:text-blue-900 font-medium">고객센터</a>
            <span className="text-slate-300">|</span>
            <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold">웹하드 ID : fbkrcg / PW : 1234</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header & Search */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="/" className="text-3xl font-black text-blue-900 tracking-tighter flex items-center gap-2">
              <Printer className="text-orange-500" size={32} />
              FBKR_CGDemo
            </a>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center border-2 border-blue-900 rounded-lg overflow-hidden w-[420px] shadow-sm">
              <input 
                type="text" 
                placeholder="원하시는 인쇄 품목을 검색해보세요." 
                className="w-full px-4 py-2 outline-none text-sm"
              />
              <button className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 flex items-center justify-center transition">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Quick Menu Icons */}
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-900">
              <User size={22} />
              <span className="mt-1 font-medium">마이페이지</span>
            </button>
            <button className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-900">
              <ShoppingCart size={22} />
              <span className="mt-1 font-medium">장바구니</span>
            </button>
            <button 
              className="md:hidden text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* GNB Navigation Bar */}
        <nav className="bg-blue-900 text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm font-bold h-12">
            <div className="flex items-center space-x-6 overflow-x-auto py-2">
              <div className="flex items-center gap-2 bg-blue-950 px-4 py-2 rounded text-orange-400">
                <Menu size={18} />
                <span>전체 품목보기</span>
              </div>
              {categoryMenus.map((cat, idx) => (
                <a key={idx} href={`#${cat.title}`} className="hover:text-orange-300 transition-colors whitespace-nowrap px-2">
                  {cat.title}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* 3. Hero Banner & Deposit Info */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Digital & Offset Printing Leader
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              고품질 맞춤 인쇄의 기준 <br /><span className="text-orange-400">FBKR_CGDemo</span> 통합 인쇄 쇼핑몰
            </h1>
            <p className="text-slate-300 text-sm md:text-base">
              카탈로그, 책자, 리플렛, 명함, 스티커 등 기업과 개인에게 필요한 모든 인쇄물을 합리적인 가격과 최고의 품질로 제작합니다.
            </p>
          </div>

          {/* Customer & Bank Info Box */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-orange-400">
              <Phone size={18} /> 고객센터 및 입금 계좌안내
            </h3>
            <div className="space-y-2.5 text-sm text-slate-200">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>대표번호</span>
                <span className="font-bold text-white">02.2277.6777</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>운영시간</span>
                <span className="font-medium text-slate-300">평일 09:30 ~ 18:30</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">기업은행 계좌</p>
                <p className="font-mono font-bold text-white bg-black/30 p-2 rounded text-center text-xs">
                  034-085611-01-015 (주)FBKR_CGDemo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Category Grid Dashboard (알래스카인디고 메인 스타일 구현) */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-orange-500 rounded-sm"></span>
              전체 인쇄 카테고리 안내
            </h2>
            <span className="text-sm text-slate-500">원하시는 품목을 선택하시면 상세 주문이 가능합니다.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {categoryMenus.map((category, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-900 transition group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-900 group-hover:text-orange-500 transition">
                    {category.title}
                  </h3>
                  <Layers className="text-slate-400 group-hover:text-blue-900 transition" size={20} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {category.items.map((subItem, sIdx) => (
                    <span key={sIdx} className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md shadow-2xs hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition">
                      {subItem}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <a href={`#${category.title}`} className="text-xs font-bold text-blue-900 flex items-center gap-1 hover:underline">
                    견적 및 주문하기 <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Best Products Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-blue-900 rounded-sm"></span>
              BEST PRODUCT (인기 상품)
            </h2>
            <span className="text-sm text-slate-500">FBKR_CGDemo에서 가장 선호하는 상품입니다.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bestProducts.map((item, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md transition cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded">
                    {item.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-900">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-6">{item.desc}</p>
                <div className="flex items-center text-orange-500 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  <span>바로 주문 및 견적</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Notice & Webhard Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileText size={18} className="text-blue-900" /> 공지사항
              </h3>
              <a href="#more" className="text-xs text-slate-500 hover:text-blue-900 font-medium">더보기 +</a>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center text-slate-700 hover:text-blue-900 cursor-pointer">
                <span className="truncate">2026년 설 연휴 배송 마감 공지 & 업무 일정 안내</span>
                <span className="text-xs text-slate-400">2026-01-20</span>
              </li>
              <li className="flex justify-between items-center text-slate-700 hover:text-blue-900 cursor-pointer">
                <span className="truncate">신규 디지털 인쇄 장비 도입에 따른 데이터 접수 안내</span>
                <span className="text-xs text-slate-400">2026-03-11</span>
              </li>
              <li className="flex justify-between items-center text-slate-700 hover:text-blue-900 cursor-pointer">
                <span className="truncate">추석 연휴 배송 및 고객센터 휴무 안내드립니다.</span>
                <span className="text-xs text-slate-400">2026-09-10</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                <Award size={18} className="text-orange-500" /> 웹하드 전용 공간
              </h3>
              <p className="text-sm text-slate-600 mb-4">대용량 인쇄 데이터 전송을 위한 전용 웹하드 정보입니다.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-around items-center text-center shadow-inner">
              <div>
                <span className="block text-xs text-slate-400 font-medium">WEB ID</span>
                <span className="font-bold text-blue-900 font-mono text-base">fbkrcg</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">WEB PASSWORD</span>
                <span className="font-bold text-blue-900 font-mono text-base">1234</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-wrap gap-6 text-slate-200 font-semibold text-sm">
            <a href="#about" className="hover:text-orange-400">회사소개</a>
            <a href="#terms" className="hover:text-orange-400">이용약관</a>
            <a href="#location" className="hover:text-orange-400">오시는길</a>
            <a href="#privacy" className="hover:text-orange-400 font-bold text-orange-400">개인정보처리방침</a>
            <a href="#email-reject" className="hover:text-orange-400">이메일주소무단수집거부</a>
            <a href="#sitemap" className="hover:text-orange-400">사이트맵</a>
          </div>
          <div className="space-y-1.5 text-slate-400 text-xs leading-relaxed">
            <p>상호명: FBKR_CGDemo(주) | 대표자: 홍길동 | 사업자등록번호: 107-87-05307</p>
            <p>주소: 서울시 중구 초동 42 아시아미디어타워 204호, 401호 | 대표전화: 02.2277.6777 | 팩스: 02.2275.5549</p>
            <p>개인정보보호책임자: 윤경준 | 이메일: support@fbkrcgdemo.co.kr | 통신판매신고: 제2011-서울중구-0269호</p>
          </div>
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-slate-500">
            <p>Copyright © 2011-2026 FBKR_CGDemo All rights reserved.</p>
            <div className="mt-3 sm:mt-0 font-bold text-blue-300 bg-blue-950 px-4 py-1.5 rounded-md border border-blue-900">
              Vercel Ready Deployment Package (Alaskaindigo UI Clone)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
