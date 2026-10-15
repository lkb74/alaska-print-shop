export class PrintPricingEngine {
  /**
   * [품목 1] 책자/카탈로그(표지 + 내지 + 제본 + 후가공) 견적 계산
   */
  static calculateBookletQuote(params: any) {
    const {
      printMethod,
      quantity,
      impositionCount,
      coverPaper,
      innerPaper,
      bindingType,
      postProcesses
    } = params;

    const coverNetSheets = Math.ceil((quantity * 4) / impositionCount);
    const innerNetSheets = Math.ceil((quantity * innerPaper.pages) / impositionCount);
    const lossSheets = printMethod === 'OFFSET' ? 150 : 5;

    const coverPaperCost = (coverNetSheets + lossSheets) * coverPaper.unitCost;
    const innerPaperCost = (innerNetSheets + lossSheets) * innerPaper.unitCost;
    const totalPaperCost = coverPaperCost + innerPaperCost;

    let totalPrintCost = 0;
    if (printMethod === 'DIGITAL') {
      const volumeDiscount = quantity >= 100 ? 0.75 : quantity >= 30 ? 0.85 : 1.0;
      const clickRateColor = 150 * volumeDiscount;
      const coverClicks = coverNetSheets * (coverPaper.colorSides === 8 ? 2 : 1);
      const innerClicks = innerNetSheets * (innerPaper.colorSides === 8 ? 2 : 1);
      totalPrintCost = (coverClicks + innerClicks) * clickRateColor;
    } else {
      const totalPages = 4 + innerPaper.pages;
      const formsCount = Math.ceil(totalPages / impositionCount);
      const basePlateFeePerForm = 60000;
      totalPrintCost = formsCount * basePlateFeePerForm;
    }

    const bindingRates: Record<string, { base: number; perBook: number; min: number }> = {
      SADDLE: { base: 5000, perBook: 120, min: 10000 },
      PERFECT: { base: 10000, perBook: 350, min: 20000 },
      RING: { base: 5000, perBook: 800, min: 15000 }
    };
    const bindRule = bindingRates[bindingType] || bindingRates.PERFECT;
    const bindingCost = Math.max(
      bindRule.min,
      bindRule.base + (quantity * bindRule.perBook) + (innerPaper.pages * 1.5 * quantity)
    );

    let postProcessCost = 0;
    const postProcessDetails = (postProcesses || []).map((proc: any) => {
      const calculated = proc.baseFee + (proc.unitPrice * quantity);
      const finalProcCost = Math.max(proc.minCharge, calculated);
      postProcessCost += finalProcCost;
      return { name: proc.name, cost: finalProcCost };
    });

    const rawSupplyPrice = totalPaperCost + totalPrintCost + bindingCost + postProcessCost;
    const supplyPrice = Math.floor(rawSupplyPrice / 100) * 100;
    const vat = Math.floor(supplyPrice * 0.1);
    const totalPrice = supplyPrice + vat;

    return {
      summary: {
        supplyPrice,
        vat,
        totalPrice,
        unitPricePerBook: Math.round(supplyPrice / quantity)
      },
      breakdown: {
        paperCost: Math.round(totalPaperCost),
        printCost: Math.round(totalPrintCost),
        bindingCost: Math.round(bindingCost),
        postProcessCost: Math.round(postProcessCost),
        postProcessDetails
      }
    };
  }

  /**
   * [품목 2] 명함 (일반합판 명함 & 고급수입지 명함) 자동견적
   */
  static calculateBusinessCard(params: {
    paperGroup: 'STANDARD' | 'PREMIUM';
    quantity: number;
    sides: 4 | 8;
    widthMm: number;
    heightMm: number;
    roundingCorners: boolean;
    goldFoil: boolean;
  }) {
    const widthMultiplier = Math.ceil(params.widthMm / 92);
    const heightMultiplier = Math.ceil(params.heightMm / 52);
    const panelMultiplier = Math.max(1, widthMultiplier * heightMultiplier);

    const baseMatrix: Record<string, Record<number, number>> = {
      STANDARD: { 200: 4500, 500: 6500, 1000: 11000 },
      PREMIUM: { 200: 9500, 500: 16000, 1000: 28000 },
    };
    const tierPrice = baseMatrix[params.paperGroup][params.quantity] || 15000;
    const sideFactor = params.sides === 8 ? 1.0 : 0.85;
    const printAndPaperCost = Math.round(tierPrice * sideFactor * panelMultiplier);

    let postProcessCost = 0;
    if (params.roundingCorners) {
      postProcessCost += Math.max(3000, (params.quantity / 200) * 1500);
    }
    if (params.goldFoil) {
      const copperPlateFee = 25000;
      const foilWorkFee = (params.quantity / 200) * 6000;
      postProcessCost += copperPlateFee + foilWorkFee;
    }

    const supplyPrice = Math.floor((printAndPaperCost + postProcessCost) / 100) * 100;
    return {
      panelMultiplier,
      printAndPaperCost,
      postProcessCost,
      supplyPrice,
      vat: Math.floor(supplyPrice * 0.1),
      totalPrice: Math.floor(supplyPrice * 1.1),
    };
  }

  /**
   * [품목 3] 합판 전단지 (연 단위 계산)
   */
  static calculateGangrunFlyer(params: {
    sizeCode: 'A4' | 'B5_16CUT' | 'A3' | 'B4_8CUT';
    paperGrammage: 100 | 150 | 180;
    reamCount: number;
    foldType: 'NONE' | '2FOLD' | '3FOLD';
  }) {
    const baseReamPriceByGrammage: Record<number, number> = {
      100: 58000,
      150: 82000,
      180: 98000,
    };
    const sizeMultiplierMap = { A4: 1.0, B5_16CUT: 0.85, A3: 2.0, B4_8CUT: 1.7 };
    const sizeFactor = sizeMultiplierMap[params.sizeCode];
    const volumeFactor = params.reamCount >= 5 ? 0.88 : params.reamCount >= 2 ? 0.94 : 1.0;

    const baseCost = baseReamPriceByGrammage[params.paperGrammage] * sizeFactor * params.reamCount * volumeFactor;

    let foldCost = 0;
    if (params.foldType === '2FOLD') foldCost = Math.max(15000, params.reamCount * 12000);
    if (params.foldType === '3FOLD') foldCost = Math.max(20000, params.reamCount * 16000);

    const actualSheetCount = Math.round(
      params.reamCount * (params.sizeCode.includes('A3') || params.sizeCode.includes('8CUT') ? 2000 : 4000)
    );

    const supplyPrice = Math.floor((baseCost + foldCost) / 100) * 100;
    return {
      actualSheetCount,
      printCost: Math.round(baseCost),
      foldCost,
      supplyPrice,
      vat: Math.floor(supplyPrice * 0.1),
      totalPrice: Math.floor(supplyPrice * 1.1),
    };
  }

  /**
   * [품목 4] 비규격 도무송(모양) 스티커 & 재단 스티커 면적 비례 계산
   */
  static calculateCustomSticker(params: {
    material: 'ART_COATED' | 'YUPO_WATERPROOF' | 'TRANSPARENT_PET';
    shape: 'RECT_CUT' | 'FREE_DOMUSONG';
    widthMm: number;
    heightMm: number;
    quantity: number;
  }) {
    const workAreaSqCm = ((params.widthMm + 4) * (params.heightMm + 4)) / 100;
    const materialRateMap = {
      ART_COATED: 0.42,
      YUPO_WATERPROOF: 0.68,
      TRANSPARENT_PET: 0.75,
    };
    const unitAreaRate = materialRateMap[params.material];

    const qtyDiscount =
      params.quantity >= 5000 ? 0.35 :
      params.quantity >= 1000 ? 0.55 :
      params.quantity >= 500  ? 0.75 : 1.0;

    const dieCutSetupFee = params.shape === 'FREE_DOMUSONG' ? 12000 : 4000;
    const rawCost = dieCutSetupFee + (workAreaSqCm * unitAreaRate * params.quantity * qtyDiscount);
    const supplyPrice = Math.max(10000, Math.floor(rawCost / 100) * 100);

    return {
      workAreaSqCm: Number(workAreaSqCm.toFixed(2)),
      dieCutSetupFee,
      unitPricePerSticker: Math.round(supplyPrice / params.quantity),
      supplyPrice,
      vat: Math.floor(supplyPrice * 0.1),
      totalPrice: Math.floor(supplyPrice * 1.1),
    };
  }
}
