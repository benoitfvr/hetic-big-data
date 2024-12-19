import { useMemo } from "react"

export default function About() {
    const mapFeatures = useMemo(() => [
        "Visualisation interactive des stations de vélos en France",
        "Affichage en temps réel de la disponibilité des vélos",
        "Filtrage par ville et réseau",
        "Carte des infractions par arrondissement à Paris",
        "Interface intuitive avec contrôles de couches"
    ], [])

    const statsFeatures = useMemo(() => [
        "Distribution des vélos par réseau",
        "Statistiques des infractions par arrondissement", 
        "Analyse de la disponibilité des stations",
        "Top 10 des stations par capacité",
        "Répartition vélos classiques vs électriques",
        "Taux d'occupation des stations"
    ], [])

    return (
        <div className="container mx-auto px-4 py-8 mt-32 max-w-screen-lg">
            <h1 className="text-3xl font-bold mb-8">À propos de l'application</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Carte Interactive</h2>
                    <p className="text-gray-600 mb-4">
                        Notre carte interactive permet de visualiser en temps réel la disponibilité des vélos dans toute la France, 
                        avec un focus particulier sur les infractions à Paris.
                    </p>
                    <h3 className="font-medium mb-2">Fonctionnalités principales:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {mapFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Statistiques Détaillées</h2>
                    <p className="text-gray-600 mb-4">
                        Notre tableau de bord statistique offre une vue complète de l'utilisation des vélos 
                        et de la distribution des infractions.
                    </p>
                    <h3 className="font-medium mb-2">Analyses disponibles:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {statsFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Sources des Données</h2>
                    <div className="space-y-4 text-gray-600">
                        <p>
                            Les données sur les stations de vélos sont mises à jour en temps réel via les API 
                            des différents réseaux de vélos en libre-service.
                        </p>
                        <p>
                            Les données sur les infractions proviennent de la Direction de la Prévention, 
                            de la Maintenance et de la Protection (DPMP) de la ville de Paris.
                        </p>
                        <p>
                            Les délimitations des arrondissements sont basées sur les données 
                            géographiques officielles de la ville de Paris.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
