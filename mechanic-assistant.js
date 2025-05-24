
// Definir niveles de urgencia y respuestas comunes
const URGENCY_LEVELS = {
  HIGH: "Alta - Requiere atención inmediata",
  MEDIUM: "Media - Programar revisión esta semana",
  LOW: "Baja - Puede esperar a próximo mantenimiento"
};

const commonProblems = {
  'ruido': {
    urgency: URGENCY_LEVELS.MEDIUM,
    causes: [
      "Problemas en la suspensión",
      "Rodamientos desgastados",
      "Frenos en mal estado"
    ],
    recommendations: [
      "Agendar una revisión para diagnosticar el origen exacto del ruido",
      "Evitar circular a alta velocidad hasta la revisión",
      "Tomar nota de cuándo y en qué condiciones ocurre el ruido"
    ]
  },
  'frenos': {
    urgency: URGENCY_LEVELS.HIGH,
    causes: [
      "Pastillas desgastadas",
      "Discos rayados",
      "Líquido de frenos bajo"
    ],
    recommendations: [
      "Acudir inmediatamente al taller",
      "Evitar conducir si el pedal está muy suave",
      "Mantener mayor distancia con otros vehículos"
    ]
  },
  'motor': {
    urgency: URGENCY_LEVELS.HIGH,
    causes: [
      "Falta de mantenimiento",
      "Problemas de inyección",
      "Fallas eléctricas"
    ],
    recommendations: [
      "Traer el vehículo a revisión inmediata",
      "Evitar conducir largas distancias",
      "Tomar nota de cualquier luz de advertencia"
    ]
  }
};

function analyzeCarProblem(description) {
  description = description.toLowerCase();
  let response = {
    urgency: URGENCY_LEVELS.LOW,
    causes: ["Se requiere más información para un diagnóstico preciso"],
    recommendations: ["Agendar una revisión general"]
  };

  // Analizar el texto para encontrar palabras clave
  for (const [problem, data] of Object.entries(commonProblems)) {
    if (description.includes(problem)) {
      response = data;
      break;
    }
  }

  return response;
}

function createChatBubble(message, isUser = false) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${isUser ? 'user' : 'assistant'}`;
  bubble.textContent = message;
  return bubble;
}

function initMechanicAssistant() {
  const chatContainer = document.getElementById('chat-container');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  function handleMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Mostrar mensaje del usuario
    chatContainer.appendChild(createChatBubble(message, true));
    messageInput.value = '';

    // Analizar el problema y generar respuesta
    const analysis = analyzeCarProblem(message);
    
    // Crear respuesta del asistente
    const response = `
    Nivel de urgencia: ${analysis.urgency}
    
    Posibles causas:
    ${analysis.causes.join('\n')}
    
    Recomendaciones:
    ${analysis.recommendations.join('\n')}
    `;

    // Mostrar respuesta con pequeño delay para simular procesamiento
    setTimeout(() => {
      chatContainer.appendChild(createChatBubble(response));
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 500);
  }

  sendButton.addEventListener('click', handleMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleMessage();
  });
}

window.addEventListener('load', initMechanicAssistant);
