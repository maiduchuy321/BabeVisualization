// utils.ts - Các utility functions

export const formatAxisTick = (tick: string, maxLength = 18): string => {
    if (!tick) return '';
    // Nếu tick có chứa dấu ngoặc đơn (ví dụ: "Nhỏ (0-10 KH/tuần)"), thì giữ nguyên nếu độ dài không quá lớn
    if (tick.includes('(') && tick.includes(')') && tick.length < maxLength + 5) return tick;
    return tick.length > maxLength ? `${tick.substring(0, maxLength - 3)}...` : tick;
  };
  
export const extractNumberImproved = (value: string | number | undefined, forRevenue = false): number => {
    if (value === undefined || value === null) return 0;
    const strValue = String(value).toLowerCase().trim();
  
    if (strValue === "0" || strValue === "" || strValue.includes("không") || strValue.includes("chưa")) {
      return 0;
    }
    if (strValue.includes("rất ít") || strValue.includes("it")) {
      return 1;
    }
    if (strValue.includes("thỉnh thoảng")) {
      return 5;
    }
    if (forRevenue) {
      const parsed = parseInt(strValue, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
  
    const numbers = strValue.match(/\d+(\.\d+)?/g); // Also match decimals if any
    if (numbers) {
      if (numbers.length > 1 && strValue.includes('-')) {
        return (parseFloat(numbers[0]) + parseFloat(numbers[numbers.length-1])) / 2; // Use first and last for range
      }
      return parseFloat(numbers[0]);
    }
    return 0;
  };
  
  export const COLORS = [
    '#4CAF50', '#2196F3', '#ff9800', '#f44336', '#9c27b0', 
    '#00bcd4', '#795548', '#607d8b', '#FFEB3B', '#E91E63'
  ];