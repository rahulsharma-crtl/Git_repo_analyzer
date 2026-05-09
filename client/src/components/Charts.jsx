import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function LanguageChart({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '8px', color: '#0f172a' }}
          itemStyle={{ color: '#0f172a' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RepoStarsChart({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  // Take top 10 repos by stars
  const sortedData = [...data].sort((a, b) => b.stars - a.stars).slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.1)" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#475569" 
          fontSize={12} 
          tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
        />
        <YAxis stroke="#475569" fontSize={12} />
        <Tooltip
          cursor={{ fill: 'rgba(15,23,42,0.05)' }}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '8px', color: '#0f172a' }}
        />
        <Bar dataKey="stars" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
