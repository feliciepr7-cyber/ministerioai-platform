// Script para sincronizar GPTs faltantes a la base de datos de producción
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function syncProductionGPTs() {
  console.log('Iniciando sincronización de GPTs a producción...');
  
  try {
    // Verificar GPTs existentes
    const existingGPTs = await sql`SELECT name FROM gpt_models`;
    console.log('GPTs existentes:', existingGPTs.length);
    
    // Lista de los 2 GPTs nuevos que necesitamos agregar
    const newGPTs = [
      {
        name: 'Capacitacion Bíblica para Servidores de Ministerio',
        description: 'Formación integral para servidores y líderes de ministerio cristiano. Proporciona capacitación bíblica estructurada y herramientas prácticas para el liderazgo en la iglesia, desarrollando competencias ministeriales sólidas basadas en principios bíblicos.',
        icon: 'fas fa-graduation-cap',
        required_plan: 'basic'
      },
      {
        name: 'Diccionario Bíblico',
        description: 'Recurso completo para entender términos, personajes y conceptos bíblicos. Incluye definiciones detalladas, contexto histórico y cultural, referencias cruzadas y etimología para un estudio profundo de las Escrituras.',
        icon: 'fas fa-book-open',
        required_plan: 'basic'
      }
    ];
    
    // Insertar solo si no existen
    for (const gpt of newGPTs) {
      const exists = existingGPTs.find(g => g.name === gpt.name);
      if (!exists) {
        await sql`
          INSERT INTO gpt_models (name, description, icon, required_plan) 
          VALUES (${gpt.name}, ${gpt.description}, ${gpt.icon}, ${gpt.required_plan})
        `;
        console.log(`✅ Agregado: ${gpt.name}`);
      } else {
        console.log(`⏭️ Ya existe: ${gpt.name}`);
      }
    }
    
    // Verificar resultado final
    const finalCount = await sql`SELECT COUNT(*) as count FROM gpt_models`;
    console.log(`🎉 Total GPTs en producción: ${finalCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  syncProductionGPTs();
}

export { syncProductionGPTs };