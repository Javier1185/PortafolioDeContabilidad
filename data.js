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

  CÓMO EDITAR PORTADA / CONCLUSIÓN / BITÁCORAS:
  Estas carpetas no muestran una lista de archivos, sino texto
  directo (como una página). Edita el HTML dentro de "content".
  Cada Bitácora es una subcarpeta con su propio "content" —
  agrega o quita bitácoras copiando ese mismo patrón.
  ============================================================
*/

const FOLDERS = [
  {
    id: "portada",
    label: "1. Portada",
    type: "folders",
    color: "#f1bf19",
    subfolders: [
      {
        id: "portada-page",
        label: "Portada",
        page: "pages/portada.html"
      },
      {
        id: "presentacion",
        label: "Presentación del Estudiante",
        page: "pages/presentacion.html"
      },
    ]
  },
  {
    id: "plan",
    label: "2. Plan de contenido",
    type: "files",
    color: "#1e2f94",
    path: "2-plan-de-contenido",
    items: [
      { name: "1277 CONTABILIDAD GENERAL_CIBERSEGURIDAD(1).pdf", label: "Plan de Contenido - Contabilidad General" },
    ]
  },
  {
    id: "material",
    label: "3. Material de clases",
    type: "files",
    color: "#f0541c",
    path: "3-material-de-clases",
    items: [
      { name: "CLASE No. 1 - I-2026 SISTEMAS.pdf", label: "Clase No. 1 - I-2026" },
      { name: "Clase No. 2 - Principios Contables 2026 (1).pdf", label: "Clase No. 2 - Principios Contables 2026" },
      { name: "Módulo II - Grupos de Cuentas y Ecuación Básica (1).pdf", label: "Módulo II - Grupos de Cuentas y Ecuación Básica" },
      { name: "PLANILLA DE PAGO (1).pdf", label: "Planilla de Pago" },
      { name: "EXPLICACIÓN- FORMATO PLANILLA QUINCENAL - 2026.xlsx", label: "Explicación - Formato Planilla Quincenal" },
      { name: "Practica EXAMEN FINAL DE CONTABILIDAD -2026.pdf", label: "Práctica Examen Final" },
    ]
  },
  {
    id: "actividades",
    label: "4. Actividades",
    type: "folders",
    color: "#2f8c5f",
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
        items: [
            { name: "Parcial1.pdf", label: "Parcial 1" },
            { name: "Prueba B- Javier Forchiney.xlsx", label: "Parcial 2" },
        ]
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
    id: "bitacoras",
    label: "5. Bitácoras",
    type: "folders",
    color: "#0a99ff",
    subfolders: [
      {
        id: "bitacora1",
        label: "Bitácora 1",
        content: `
          <h2>Bitácora de Aprendizaje</h2>
          <h3>Módulo I – Importancia de la Contabilidad y Tipos de Contabilidad</h3>
          <p>Durante el desarrollo de este módulo comprendí la importancia que tiene la contabilidad dentro de cualquier empresa u organización. Aprendí que no solo consiste en registrar operaciones financieras, sino que también es una herramienta fundamental para la toma de decisiones, el control interno, la planificación y el crecimiento de un negocio. Además, conocí las diferencias entre la contabilidad administrativa y la contabilidad financiera, entendiendo el propósito y la utilidad que tiene cada una dentro del ámbito empresarial.</p>
          <p>Este fue un módulo que disfruté mucho porque la profesora complementó la teoría con explicaciones claras y ejemplos prácticos que facilitaron la comprensión de cada tema. Considero que esos aportes hicieron que el aprendizaje fuera más dinámico e interesante, permitiéndome relacionar los conceptos con situaciones reales.</p>
          <p>Afortunadamente, no tuve complicaciones durante el desarrollo de este módulo. Los contenidos fueron presentados de manera organizada, lo que me permitió comprenderlos con facilidad y mantener un buen ritmo de aprendizaje. Finalicé esta parte del curso con una base sólida sobre la importancia de la contabilidad y su aplicación en el mundo de los negocios.</p>
        `
      },
      {
        id: "bitacora2",
        label: "Bitácora 2",
        content: `
          <h2>Bitácora de Aprendizaje</h2>
          <h3>Módulo VIII – Sistema de Pago y Registro de Planilla</h3>
          <p>En este módulo he comenzado a aprender sobre el sistema de pago y registro de planilla, uno de los procesos más importantes dentro de la administración de una empresa. He conocido aspectos relacionados con los salarios, las jornadas laborales, las horas extras, las deducciones legales, las contribuciones sociales, el impuesto sobre la renta, el décimo tercer mes, las vacaciones y otros elementos que forman parte del cálculo de una planilla de pago.</p>
          <p>Hasta el momento, este módulo me ha parecido muy interesante porque permite comprender cómo se calcula realmente el salario de un trabajador y todas las obligaciones que debe cumplir una empresa respecto a sus colaboradores. Al igual que en los módulos anteriores, disfruté mucho las explicaciones y los complementos proporcionados por la profesora, ya que ayudaron a entender mejor cada procedimiento y la aplicación de las normas en casos prácticos.</p>
          <p>No he tenido dificultades para comprender los temas desarrollados. Sin embargo, al ser el módulo más reciente, considero que todavía me encuentro en proceso de aprendizaje y práctica, especialmente en la elaboración y el cálculo de planillas completas. Confío en que, con los prácticas que haré, fortaleceré aún más estos conocimientos y podré aplicarlos correctamente en situaciones reales.</p>
        `
      },
      {
        id: "bitacora3",
        label: "Bitácora 3",
        content: `
          <h2>Bitácora de Aprendizaje</h2>
          <h3>Módulo – Principios Contables</h3>
          <p>En este módulo aprendí la importancia de los principios contables y cómo estos constituyen la base para registrar y presentar correctamente la información financiera de una empresa. Comprendí conceptos fundamentales como la entidad económica, el negocio en marcha, la unidad de medida, el principio del devengado, el período contable, la realización, la valuación del costo, la prudencia, la revelación suficiente y la importancia relativa, entre otros. Todos estos principios me permitieron entender que la contabilidad debe seguir normas que garanticen información clara, confiable y útil para la toma de decisiones.</p>
          <p>Este fue un tema que disfruté bastante, ya que la profesora explicó cada principio de forma clara y siempre complementó la teoría con ejemplos prácticos y situaciones reales, lo que facilitó mucho la comprensión de cada concepto. Considero que esos complementos hicieron que el aprendizaje fuera más dinámico y permitieron relacionar los principios con el funcionamiento de las empresas.</p>
          <p>Durante el desarrollo de este módulo no tuve complicaciones para comprender los contenidos. Gracias a la metodología utilizada en clase y al material proporcionado, pude seguir el ritmo de aprendizaje sin dificultades y fortalecer mis conocimientos sobre las normas que rigen la práctica contable.</p>
        `
      },
      {
        id: "bitacora4",
        label: "Bitácora 4",
        content: `
          <h2>Bitácora de Aprendizaje</h2>
          <h3>Módulo II – Grupos de Cuentas y Ecuación Básica</h3>
          <p>En este módulo aprendí sobre los grupos de cuentas, la ecuación contable básica y el proceso mediante el cual se registran las operaciones de una empresa. Comprendí la importancia de las cuentas de activo, pasivo, patrimonio, ingresos, costos y gastos, además de la clasificación de las cuentas reales, nominales y de orden. También reforcé mis conocimientos sobre el funcionamiento del débito y el crédito, y la manera en que todas las transacciones deben mantener el equilibrio de la ecuación contable.</p>
          <p>Este módulo me pareció muy interesante porque permitió comprender cómo se estructura la información financiera desde el inicio del proceso contable. Disfruté mucho las explicaciones y los ejemplos proporcionados por la profesora, ya que hicieron más sencillo entender temas que al principio pueden parecer complejos. Los ejercicios desarrollados en clase y los complementos adicionales ayudaron a reforzar los conocimientos y a visualizar cómo se aplican estos conceptos en situaciones reales.</p>
          <p>No presenté dificultades durante el aprendizaje de este módulo. La explicación de cada tema fue clara y ordenada, lo que me permitió comprender con facilidad la clasificación de las cuentas y la lógica de la ecuación contable. Considero que este conocimiento será una base importante para los siguientes temas de la asignatura aunque no sea mi area pero de igual forma sirve para mi formación profesional.</p>
        `
      },
    ]
  },
  {
    id: "conclusion",
    label: "6. Conclusion",
    type: "page",
    color: "#b80e36",
    page: "pages/conclusion.html"
  },
];