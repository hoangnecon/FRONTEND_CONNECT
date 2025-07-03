// src/admin/PeakHoursHeatmap.js
import React, { useMemo } from 'react';

const PeakHoursHeatmap = ({ ordersByDate }) => {
  const heatmapData = useMemo(() => {
    const data = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));
    
    Object.values(ordersByDate).flat().forEach(order => {
      const orderDate = new Date(order.date + 'T' + order.time);
      const dayOfWeek = (orderDate.getDay() + 6) % 7; // Monday = 0
      const hour = orderDate.getHours();
      data[dayOfWeek][hour]++;
    });
    
    return data;
  }, [ordersByDate]);

  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const maxOrders = Math.max(...heatmapData.flat(), 1);

  const getColor = (value) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = Math.min(1, value / maxOrders);
    if (intensity < 0.2) return 'bg-blue-200';
    if (intensity < 0.4) return 'bg-blue-300';
    if (intensity < 0.6) return 'bg-blue-400';
    if (intensity < 0.8) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  return (
    <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-primary-headline mb-4">Phân tích Giờ cao điểm</h3>
      <div className="overflow-x-auto">
        <div className="flex">
          <div className="w-12">&nbsp;</div>
          {hours.map(hour => (
            <div key={hour} className="w-8 text-center text-xs font-mono">{hour}h</div>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div key={day} className="flex items-center">
            <div className="w-12 font-bold text-sm text-right pr-2">{day}</div>
            {heatmapData[dayIndex].map((count, hourIndex) => (
              <div
                key={`${dayIndex}-${hourIndex}`}
                className={`w-8 h-8 rounded border border-white/50 tooltip ${getColor(count)}`}
                title={`${count} đơn`}
              >
                 <span className="tooltiptext">{day}, {hourIndex}h: {count} đơn</span>
              </div>
            ))}
          </div>
        ))}
      </div>
       <style jsx>{`
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 120px;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px 0;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -60px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default PeakHoursHeatmap;