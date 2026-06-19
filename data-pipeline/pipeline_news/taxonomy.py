"""Editorial taxonomy for news enrichment — entities, topics, relevance terms.

Deterministic dictionaries matched (word-boundary, case-insensitive) against a
document's title + deck. No LLM, consistent with the rest of the pipeline. Grow
these lists over time; stage3_enrich reads them, the stages don't change.

Canonical name → list of surface aliases to match.
"""

from __future__ import annotations

COMPANIES: dict[str, list[str]] = {
    "YPF": ["ypf"],
    "Pan American Energy": ["pan american energy", "pan american", "pae"],
    "Tecpetrol": ["tecpetrol"],
    "Vista Energy": ["vista energy", "vista oil", "vista oil & gas"],
    "Pampa Energía": ["pampa energía", "pampa energia"],
    "Pluspetrol": ["pluspetrol"],
    "CGC": ["compañía general de combustibles", "compania general de combustibles", "cgc"],
    "Harbour Energy": ["harbour energy", "harbour", "wintershall"],
    "TotalEnergies": ["totalenergies", "total energies"],
    "Shell": ["shell argentina", "shell"],
    "Chevron": ["chevron"],
    "ExxonMobil": ["exxonmobil", "exxon"],
    "Equinor": ["equinor"],
    "Petronas": ["petronas"],
    "PETRONAS/YPF Argentina LNG": ["argentina lng"],
    "TGS": ["transportadora de gas del sur", "tgs"],
    "TGN": ["transportadora de gas del norte", "tgn"],
    "Oldelval": ["oldelval"],
    "Capex": ["capex s.a."],
    "Golar LNG": ["golar"],
    "Southern Energy": ["southern energy"],
    "Techint": ["techint"],
    "SACDE": ["sacde"],
    "Tecnimont": ["tecnimont"],
    "GyP Neuquén": ["gas y petróleo del neuquén", "gas y petroleo del neuquen", "g&p neuquén"],
}

PEOPLE: dict[str, list[str]] = {
    "Horacio Marín": ["horacio marín", "horacio marin"],
    "Marcos Bulgheroni": ["marcos bulgheroni", "bulgheroni"],
    "Paolo Rocca": ["paolo rocca"],
    "Eduardo Rodríguez Chirillo": ["rodríguez chirillo", "rodriguez chirillo"],
    "María Tettamanti": ["maría tettamanti", "maria tettamanti", "tettamanti"],
    "Javier Milei": ["javier milei", "milei"],
}

PROJECTS: dict[str, list[str]] = {
    "VMOS (Vaca Muerta Sur)": ["vaca muerta sur", "vaca muerta oil sur", "vmos"],
    "Argentina LNG": ["argentina lng"],
    "Fortín de Piedra": ["fortín de piedra", "fortin de piedra"],
    "GPNK (Néstor Kirchner)": ["gasoducto néstor kirchner", "gasoducto nestor kirchner", "gpnk"],
    "Perito Moreno (ex-GPNK)": ["gasoducto perito moreno"],
}

# Vaca Muerta blocks / áreas
BLOCKS: list[str] = [
    "Loma Campana", "La Amarga Chica", "Bandurria Sur", "Bandurria Centro",
    "Aguada Pichana", "Aguada del Chañar", "Rincón del Mangrullo", "El Orejano",
    "Los Toldos", "Bajo del Choique", "Cruz de Lorena", "Sierras Blancas",
    "Bajada de Añelo", "Aguada Federal", "Coirón Amargo", "El Trapial",
    "Rincón La Ceniza", "La Calera", "Lindero Atravesado",
]

REGULATORS: dict[str, list[str]] = {
    "CNV": ["comisión nacional de valores", "comision nacional de valores", "cnv"],
    "ENARGAS": ["enargas"],
    "Secretaría de Energía": ["secretaría de energía", "secretaria de energia"],
    "ENRE": ["enre"],
}

# topic → trigger keywords (lowercase)
TOPICS: dict[str, list[str]] = {
    "produccion": ["producción", "produccion", "pozos", "pozo", "fractura", "fracturas",
                   "barriles", "récord", "yacimiento", "perforación", "perforacion"],
    "midstream": ["oleoducto", "gasoducto", "ducto", "midstream", "transporte de gas",
                  "terminal", "vmos", "oldelval", "tgs", "punta colorada"],
    "gnl": ["gnl", "lng", "licuefacción", "licuefaccion", "buque", "flng", "argentina lng"],
    "exportacion": ["exportación", "exportacion", "exportaciones", "export", "embarque", "cargamento"],
    "rigi": ["rigi", "régimen de incentivo", "regimen de incentivo"],
    "regulacion": ["resolución", "resolucion", "decreto", "normativa", "concesión",
                   "concesion", "audiencia", "regulación", "regulacion", "tarifa"],
    "m_a": ["adquisición", "adquisicion", "fusión", "fusion", "m&a", "farm-in",
            "farm-out", "cesión de áreas", "venta de activos", "compra de activos"],
    "financiamiento": ["obligaciones negociables", "emisión", "emision", "deuda",
                       "bono", "financiamiento", "colocación", "recompra"],
    "ambiente": ["ambiental", "ambiente", "derrame", "metano", "sismicidad",
                 "audiencia pública", "audiencia publica", "eia"],
    "laboral": ["gremio", "sindicato", "paro", "petroleros", "salarial", "conflicto laboral"],
    "servicios": ["set de fractura", "equipos de perforación", "rigs", "servicios especiales",
                  "arena", "proppant"],
    "inversion": ["inversión", "inversion", "capex", "plan de inversiones"],
}

# Broad O&G relevance net. A media doc matching none of these (and no entity)
# is treated as off-topic and dropped.
RELEVANCE_TERMS: list[str] = [
    "vaca muerta", "hidrocarburos", "petróleo", "petroleo", "crudo", "gas natural",
    "no convencional", "shale", "oleoducto", "gasoducto", "gnl", "lng", "pozo",
    "pozos", "fractura", "perforación", "perforacion", "yacimiento", "cuenca neuquina",
    "upstream", "midstream", "downstream", "refinería", "refineria", "nafta",
    "combustible", "barriles", "bpd", "regalías", "regalias", "brent", "wti",
    "oil & gas", "oil and gas", "fracking", "neuquina",
]
