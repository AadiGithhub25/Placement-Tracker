'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface PackageChartProps {
  data: any[]
}

export default function PackageChart({ data }: PackageChartProps) {
  const chartData = {
    labels: data.map(d => d.company?.name || 'Unknown'),
    datasets: [
      {
        label: 'Min Package (LPA)',
        data: data.map(d => d.minPackage),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Avg Package (LPA)',
        data: data.map(d => d.avgPackage),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Max Package (LPA)',
        data: data.map(d => d.maxPackage),
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Package (LPA)'
        }
      }
    }
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  )
}
