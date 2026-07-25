import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'

function DashboardCard({Icon,text,stats,color}) {
  return (
<div className="relative overflow-hidden rounded-2xl shadow ring ring-gray-200 dark:ring-gray-800 p-5">
  <div
    className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl`}
  />

  <div className="relative z-10">
    <div className={`mb-3 h-11 w-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
      <Icon className="size-5 text-white" />
    </div>

    <h3 className="text-3xl font-extrabold mb-2">{stats}</h3>
    <p className="text-sm text-gray-500">{text}</p>
  </div>
</div>
  )
}

export default DashboardCard