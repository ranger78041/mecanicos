<?php
header('Content-Type: application/json');

// IMPORTANT: Replace 'YOUR_GEMINI_API_KEY' with your actual Google Gemini API key.
// This key should be kept confidential and secure on your server.
$apiKey = 'YOUR_GEMINI_API_KEY'; // <--- YOU MUST REPLACE THIS LATER

// Get the problem description from the POST request
$problemDescription = isset($_POST['problem_description']) ? trim($_POST['problem_description']) : '';

if (empty($problemDescription)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Problem description is missing.'
    ]);
    exit;
}

// Gemini API endpoint for the gemini-pro model
$geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . $apiKey;

// Prepare the prompt and request payload for Gemini API
$prompt = <<<PROMPT
Eres un asistente virtual experto en diagnóstico de problemas automotrices. Tu tarea es analizar la descripción del problema de un vehículo proporcionada por un usuario y responder únicamente con un objeto JSON.

**Restricciones Estrictas:**
1.  Tu respuesta DEBE ser un objeto JSON válido.
2.  DEBES limitar tus diagnósticos y respuestas EXCLUSIVAMENTE a problemas relacionados con automóviles, coches, vehículos motorizados.
3.  Si el problema descrito por el usuario NO parece estar relacionado con un vehículo automotor, el objeto JSON de respuesta debe ser: {"error": "El problema descrito no parece estar relacionado con un automóvil."}

**Descripción del Problema del Usuario:**
"$problemDescription"

**Formato JSON Requerido para tu Respuesta:**
```json
{
  "possibleCauses": [
    "Causa probable 1 detallada aquí.",
    "Causa probable 2 detallada aquí.",
    "Causa probable 3 detallada aquí (si aplica)."
  ],
  "urgency": "Define el nivel de urgencia aquí (ej: 'Bajo', 'Medio', 'Alto - Acción Inmediata Requerida')",
  "recommendation": "Proporciona una recomendación clara y concisa aquí, incluyendo si se debe consultar a un profesional.",
  "notes": "Si aplica, añade una nota breve aquí. Por ejemplo, si la información es insuficiente para un buen diagnóstico."
}
```

Analiza la descripción del problema del usuario y proporciona tu diagnóstico en el formato JSON especificado.
PROMPT;

$requestData = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ],
    // Optional: Configuration for generation - adjust as needed
    // 'generationConfig' => [
    //   'temperature' => 0.7,
    //   'topK' => 1,
    //   'topP' => 1,
    //   'maxOutputTokens' => 2048,
    // ],
    // Optional: Safety settings - adjust as needed
    // 'safetySettings' => [
    //   [ 'category' => 'HARM_CATEGORY_HARASSMENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE' ],
    //   [ 'category' => 'HARM_CATEGORY_HATE_SPEECH', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE' ],
    //   [ 'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE' ],
    //   [ 'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE' ],
    // ]
];

$jsonData = json_encode($requestData);

// Initialize cURL session
$ch = curl_init($geminiApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($jsonData)
]);
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Enable in production with proper CA certs
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);   // Enable in production

// Execute cURL request
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to connect to AI service (cURL Error): ' . $curlError
    ]);
    exit;
}

if ($httpcode !== 200) {
    // Attempt to decode Gemini's error response
    $errorDetails = json_decode($response, true);
    $errorMessage = 'Error communicating with AI service. HTTP Status: ' . $httpcode;
    if (isset($errorDetails['error']['message'])) {
        $errorMessage .= ' - Details: ' . $errorDetails['error']['message'];
    } elseif (!empty($response)) {
        $errorMessage .= ' - Response: ' . substr($response, 0, 200); // Show part of the raw response
    }
    echo json_encode([
        'status' => 'error',
        'message' => $errorMessage
    ]);
    exit;
}

// The Gemini API response is expected to be JSON.
// The actual content we want is usually in $response->candidates[0]->content->parts[0]->text
$geminiResponse = json_decode($response, true);

// Basic check for expected structure
if (isset($geminiResponse['candidates'][0]['content']['parts'][0]['text'])) {
    $aiContentText = $geminiResponse['candidates'][0]['content']['parts'][0]['text'];
    
    // Attempt to decode the AI's text if it's supposed to be JSON
    $aiJsonOutput = json_decode($aiContentText, true);
    
    if (json_last_error() === JSON_ERROR_NONE && is_array($aiJsonOutput)) {
        // If the AI returned valid JSON as text
        echo json_encode([
            'status' => 'success',
            'data' => $aiJsonOutput
        ]);
    } else {
        // If the AI did not return JSON, but plain text, wrap it.
        // This might happen if the prompt isn't perfectly instructing JSON output yet.
        // Or if Gemini itself returns an error message as plain text within a 200 OK.
        echo json_encode([
            'status' => 'success_text', // Indicate that the AI response was text, not the expected JSON
            'message' => 'AI response received as text, not structured JSON. Further parsing might be needed or prompt adjustment.',
            'raw_ai_text' => $aiContentText
        ]);
    }
} elseif (isset($geminiResponse['error'])) {
    // Handle cases where Gemini API itself returns an error structure (e.g. invalid API key, quota issues)
     echo json_encode([
        'status' => 'error',
        'message' => 'AI service returned an error: ' . ($geminiResponse['error']['message'] ?? 'Unknown error from AI service'),
        'details' => $geminiResponse['error'] ?? []
    ]);
} else {
    // Unexpected response structure from Gemini
    echo json_encode([
        'status' => 'error',
        'message' => 'Unexpected response structure from AI service.',
        'raw_response' => $geminiResponse // send back the raw response for debugging
    ]);
}

?>
