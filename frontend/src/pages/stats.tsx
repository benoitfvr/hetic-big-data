import { Bar, BarChart } from "recharts"
import { type ChartConfig, ChartContainer } from "../components/ui/chart"

export default function Stats() {
    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]
      
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    return (
        <div className="container mx-auto px-4 py-8 mt-32">
            <h1 className="text-3xl font-bold mb-8">Statistiques des Compteurs Vélo</h1>
            
            <div className="grid grid-cols-1 gap-6 max-w-screen-sm">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Utilisation par Mois</h2>
                    <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                        <BarChart width={800} height={400} data={chartData}>
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    )
}
