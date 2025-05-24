// Configuración del chat
let isMinimized = false;

async function getOpenAIResponse(userMessage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres un asistente especializado en mecánica automotriz. Solo respondes preguntas relacionadas con problemas de automóviles, diagnósticos y recomendaciones mecánicas. Para otros temas, indicas amablemente que solo puedes ayudar con temas automotrices."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('Error en la conexión con OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    return "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.";
  }
}

function addMessage(message, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble', sender);
  bubble.textContent = message;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
  const assistant = document.getElementById('mechanic-assistant');
  const chatContainer = document.getElementById('chat-container');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const toggleButton = document.getElementById('toggle-chat');

  // Manejar minimizar/maximizar
  toggleButton.addEventListener('click', () => {
    isMinimized = !isMinimized;
    assistant.classList.toggle('minimized', isMinimized);
    assistant.classList.toggle('expanded', !isMinimized);
    toggleButton.textContent = isMinimized ? '+' : '−';
  });

  // Mensaje inicial
  const welcomeMessage = "¡Hola! Soy tu asistente virtual especializado en mecánica automotriz. ¿En qué puedo ayudarte con tu vehículo?";
  addMessage(welcomeMessage, 'assistant');

  async function handleMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    // Mostrar mensaje del usuario
    addMessage(messageText, 'user');
    messageInput.value = '';

    // Obtener y mostrar respuesta del asistente
    const response = await getOpenAIResponse(messageText);
    addMessage(response, 'assistant');
  }

  sendButton.addEventListener('click', handleMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMessage();
    }
  });
});