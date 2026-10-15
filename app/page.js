'use client';

import React, { useState } from 'react';
import { Search, ShoppingCart, User, Phone, FileText, Menu, X, ChevronRight } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    "책자/카다로그", "리플렛/포스터", "명함", "스티커", "전단", "상품권/초대장", "봉투", "양식지/NCR지", "선거홍보물"
  ];

  const bestProducts = [
    { title: "Catalog / 카탈로그", desc: "디지털 / 옵셋인쇄", tag: "BEST" },
    { title: "Leaflet / 리플렛", desc: "디지털 / 옵셋인쇄", tag: "POPULAR" },
    { title: "Flyers / 전단지", desc: "디지털 / 옵셋인쇄", tag: "HOT" },
    { title: "Stickers / 스티커", desc: "자유형태 낱장/롤 스티커", tag: "NEW" },
    { title: "Name Card / 명함", desc: "고급지 및 일반지 명함", tag: "RECOMMEND" },
    { title: "Envelope / 봉투", desc: "규격봉투 및 컬러봉투", tag: "BASIC" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-slate-100 border-b border-slate-200 text-xs text-slate-600 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-primary">고객센터: 02-2277-6777</span>
            <span className="hidden sm:inline">접수마감: PM 6:30 (토·일 휴무)</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#login" className="hover:underline">로그인</a>
            <span>|</span>
            <a href="#register" className="hover:underline">회원가입</a>
            <span>|</span>
            <a href="#guide" className="hover:underline">작업가이드</a>
            <span>|</span>
            <span className="bg-blue-100 text-primary px-2 py-0.5 rounded font-medium">웹하드 ID: fbkrcg / PW: 1234</span>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-black text-primary tracking-tighter">
              FBKR_CGDemo
            </a>
            
            <div className="hidden md:flex items-center border-2 border-primary rounded-md overflow-hidden w-96">
              <input 
                type="text" 
                placeholder="원하시는 인쇄물을 검색하세요." 
                className="w-full px-3 py-1.5 outline-none text-sm"
              />
              <button className="bg-primary text-white px-4 py-1.5 flex items-center justify-center">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex flex-col items-center text-xs text-slate-700 hover:text-primary">
              <User size={20} />
              <span className="mt-1">마이페이지</span>
            </button>
            <button className="flex flex-col items-center text-xs text-slate-700 hover:text-primary">
              <ShoppingCart size={20} />
              <span className="mt-1">장바구니</span>
            </button>
            <button 
              className="md:hidden text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <nav className="bg-primary text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-8 text-sm font-semibold h-12">
            <div className="bg-blue-900 h-full px-6 flex items-center gap-2 cursor-pointer">
              <Menu size={18} />
              <span>전체 인쇄 품목</span>
            </div>
            {categories.map((cat, idx) => (
              <a key={idx} href={`#${cat}`} className="hover:text-orange-300 transition-colors">
                {cat}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-blue-900 to-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              High Quality Printing Service
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              최고의 품질과 신뢰를 담은 <br />인쇄 솔루션 <span className="text-orange-400">FBKR_CGDemo</span>
            </h1>
            <p className="text-blue-100 text-base">
              카탈로그, 리플렛, 명함, 스티커까지 필요한 모든 인쇄물을 빠르고 정확하게 제작해 드립니다.
            </p>
            <div className="pt-4 flex justify-center md:justify-start gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition">
                견적 문의하기
              </button>
              <button className="bg-white text-primary hover:bg-slate-100 font-semibold px-6 py-3 rounded-lg shadow transition">
                업종별 샘플보기
              </button>
            </div>
          </div>
          <div className="mt-8 md:mt-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Phone size={20} className="text-orange-400" /> 고객센터 및 입금 안내
            </h3>
            <div className="space-y-3 text-sm text-blue-50">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>대표번호</span>
                <span className="font-bold text-white">02-2277-6777</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>평일 마감</span>
                <span className="font-bold text-white">PM 6:30 (토·일 휴무)</span>
              </div>
              <div>
                <p className="text-xs text-blue-200 mb-1">기업은행 계좌안내</p>
                <p className="font-mono font-bold text-white bg-black/20 p-2 rounded text-center">
                  034-085611-01-015 (주)FBKR_CGDemo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full inline-block"></span>
            BEST PRODUCT
          </h2>
          <span className="text-sm text-slate-500">FBKR_CGDemo에서 가장 인기 있는 품목입니다.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bestProducts.map((item, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-primary text-xs font-bold px-2.5 py-1 rounded">
                  {item.tag}
                </span>
                <FileText className="text-slate-400 group-hover:text-primary transition" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
              <div className="flex items-center text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
                <span>바로 주문하기</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-lg">공지사항</h3>
              <a href="#more" className="text-xs text-slate-500 hover:underline">더보기 +</a>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center text-slate-700 hover:text-primary cursor-pointer">
                <span className="truncate">2026년 설 연휴 배송 마감 공지 & 업무 일정 안내</span>
                <span className="text-xs text-slate-400">2026-01-20</span>
              </li>
              <li className="flex justify-between items-center text-slate-700 hover:text-primary cursor-pointer">
                <span className="truncate">신규 디지털 인쇄 장비 도입에 따른 안내</span>
                <span className="text-xs text-slate-400">2026-03-11</span>
              </li>
              <li className="flex justify-between items-center text-slate-700 hover:text-primary cursor-pointer">
                <span className="truncate">추석 연휴 배송 및 고객센터 휴무 안내</span>
                <span className="text-xs text-slate-400">2026-09-10</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">웹하드 전용 공간</h3>
              <p className="text-sm text-slate-600 mb-4">대용량 인쇄 데이터 전송을 위한 웹하드 접속 정보입니다.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-around items-center text-center">
              <div>
                <span className="block text-xs text-slate-500">WEBID</span>
                <span className="font-bold text-primary font-mono">fbkrcg</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <span className="block text-xs text-slate-500">WEBPW</span>
                <span className="font-bold text-primary font-mono">1234</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-xs py-10 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap gap-4 text-slate-300 font-medium">
            <a href="#about" className="hover:text-white">회사소개</a>
            <a href="#terms" className="hover:text-white">이용약관</a>
            <a href="#location" className="hover:text-white">오시는길</a>
            <a href="#privacy" className="hover:text-white text-orange-400 font-bold">개인정보처리방침</a>
            <a href="#email-reject" className="hover:text-white">이메일주소무단수집거부</a>
          </div>
          <div className="space-y-1 text-slate-400">
            <p>상호명: FBKR_CGDemo(주) | 대표자: 홍길동 | 사업자등록번호: 107-87-05307</p>
            <p>주소: 서울시 중구 초동 42 아시아미디어타워 | 대표전화: 02-2277-6777 | 팩스: 02-2275-5549</p>
            <p>개인정보보호책임자: 윤경준 | 이메일: support@fbkrcgdemo.co.kr</p>
          </div>
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-slate-500">
            <p>Copyright © 2011-2026 FBKR_CGDemo All rights reserved.</p>
            <div className="mt-2 sm:mt-0 font-bold text-primary bg-blue-50 px-3 py-1 rounded">
              Vercel Ready Deployment Package
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
