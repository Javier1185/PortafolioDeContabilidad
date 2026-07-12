/*
  ============================================================
  REGISTRO DE CONTENIDO DEL PORTAFOLIO
  ============================================================
  Estructura basada en las carpetas reales del portafolio de
  Javier Forchiney (Contabilidad).

  CÓMO AGREGAR UN ARCHIVO:
  1. Copia el archivo real dentro de la carpeta que le
     corresponde en /files (mira la ruta "path" de cada carpeta
     más abajo).
  2. Agrega una línea dentro de "items" con:
     - name  -> nombre EXACTO del archivo, con extensión
     - label -> título que va a ver la profesora
     - desc  -> (opcional) descripción corta

  CÓMO EDITAR PORTADA / CONCLUSIÓN:
  Esas dos carpetas no muestran una lista de archivos, sino un
  texto (como una página). Edita el HTML dentro de "content".
  ============================================================
*/

const FOLDERS = [
  {
    id: "portada",
    label: "1. Portada",
    type: "page",
    color: "#8E7CC3",
    content: `
      <h2>Bienvenida</h2>
      <p>Contenido de portada pendiente — Javier lo agregará próximamente.</p>
    `
  },
  {
    id: "plan",
    label: "2. Plan de contenido",
    type: "files",
    color: "#3B82C4",
    path: "2-plan-de-contenido",
    items: [
      { name: "1277 CONTABILIDAD GENERAL_CIBERSEGURIDAD(1).docx", label: "Plan de Contenido - Contabilidad General" },
    ]
  },
  {
    id: "material",
    label: "3. Material de clases",
    type: "files",
    color: "#E2733A",
    path: "3-material-de-clases",
    items: [
      { name: "CLASE No. 1 - I-2026 SISTEMAS.pptx", label: "Clase No. 1 - I-2026" },
      { name: "PLANILLA DE PAGO (1).pptx", label: "Planilla de Pago" },
    ]
  },
  {
    id: "actividades",
    label: "4. Actividades",
    type: "folders",
    color: "#2E7D5B",
    path: "4-actividades",
    subfolders: [
      {
        id: "exposicion",
        label: "Exposición Grupal",
        path: "exposicion-grupal",
        items: [
          { name: "MÓDULO III ITBMS - CONCEPTO, ASPECTOS LEGALES Y CONTRIBUYENTES.pdf", label: "Módulo III - ITBMS" },
          { name: "Respuestas de formuario Grupo No.2  ITBMS.pdf", label: "Respuestas de Formulario - Grupo 2" },
          { name: "Resumen de ITBMS Concepto, Aspectos Legales y Contribuyentes.pdf", label: "Resumen ITBMS" },
        ]
      },
      {
        id: "parciales",
        label: "Parciales",
        path: "parciales",
        items: []
      },
      {
        id: "practicas",
        label: "Prácticas",
        path: "practicas",
        items: [
          { name: "Mapa mental - Principios de contabilidad.pdf", label: "Mapa Mental - Principios de Contabilidad" },
        ]
      },
      {
        id: "talleres",
        label: "Talleres",
        path: "talleres",
        items: [
          { name: "Caso Theranos.pdf", label: "Caso Theranos" },
          { name: "CLASIFICACION CUENTAS A Y B - Javier Forchiney.xlsx", label: "Clasificación Cuentas A y B" },
          { name: "Cuadro comparativo.pdf", label: "Cuadro Comparativo" },
          { name: "ESTUDIANTES PROBLEMAS D-M Y BALANCE PRACTICA 1 Y 2 - copia-1.xlsx", label: "Problemas D-M y Balance - Práctica 1 y 2" },
          { name: "Javier Forchiney - Practica del 28.xlsx", label: "Práctica del 28" },
          { name: "Javier Forchiney 2.xlsx", label: "Práctica 2" },
          { name: "Tipos de cuentas-Javier Forchiney.xlsx", label: "Tipos de Cuentas" },
        ]
      },
    ]
  },
  {
    id: "conclusion",
    label: "5. Conclusion",
    type: "page",
    color: "#D4A24C",
    content: `
      <h2>Conclusión</h2>
      <p>Contenido de conclusión pendiente — Javier lo agregará próximamente.</p>
    `
  },
];