<?php
// Configuración del correo de destino - Fácil de cambiar
$recipient_email = "ranger78041@gmail.com";

// Inicializar respuesta
$response = [
    'status' => 'error',
    'message' => 'Ocurrió un error al procesar el formulario.'
];

// Verificar si se recibió una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger datos del formulario
    $name = isset($_POST['name']) ? filter_var($_POST['name'], FILTER_SANITIZE_STRING) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? filter_var($_POST['phone'], FILTER_SANITIZE_STRING) : 'No proporcionado';
    $subject = isset($_POST['subject']) ? filter_var($_POST['subject'], FILTER_SANITIZE_STRING) : '';
    $message = isset($_POST['message']) ? filter_var($_POST['message'], FILTER_SANITIZE_STRING) : '';
    
    // Validar datos requeridos
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $response['message'] = 'Por favor, complete todos los campos obligatorios.';
        echo json_encode($response);
        exit;
    }
    
    // Validar formato de correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Por favor, proporcione un correo electrónico válido.';
        echo json_encode($response);
        exit;
    }
    
    // Procesar imagen si se ha subido
    $image_info = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        // Verificar tipo de archivo
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($_FILES['image']['type'], $allowed_types)) {
            $response['message'] = 'Tipo de archivo no permitido. Por favor, suba una imagen en formato JPG, PNG, GIF o WebP.';
            echo json_encode($response);
            exit;
        }
        
        // Verificar tamaño (máximo 5MB)
        if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
            $response['message'] = 'La imagen es demasiado grande. El tamaño máximo permitido es 5MB.';
            echo json_encode($response);
            exit;
        }
        
        // Generar nombre único para el archivo
        $upload_dir = 'uploads/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_filename = 'imagen_' . date('Ymd_His') . '_' . uniqid() . '.' . $file_extension;
        $upload_path = $upload_dir . $new_filename;
        
        // Mover archivo subido
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
            $image_info = "Imagen adjunta: " . $_FILES['image']['name'] . " (guardada como: " . $new_filename . ")";
            
            // Preparar la imagen como adjunto para el correo
            $attachment = $upload_path;
            $attachment_filename = $_FILES['image']['name'];
        } else {
            $image_info = "Se intentó subir una imagen pero ocurrió un error al guardarla.";
        }
    } else {
        $image_info = "No se adjuntó ninguna imagen.";
    }
    
    // Preparar el contenido del correo
    $email_subject = "Formulario de contacto: $subject";
    $email_body = "Has recibido un nuevo mensaje desde el formulario de contacto del sitio web.\n\n";
    $email_body .= "Detalles:\n";
    $email_body .= "Nombre: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Teléfono: $phone\n";
    $email_body .= "Asunto: $subject\n\n";
    $email_body .= "Mensaje:\n$message\n\n";
    $email_body .= "$image_info\n";
    
    // Configurar cabeceras para el correo
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    // Si hay una imagen adjunta, enviar como correo con adjunto
    if (isset($attachment) && file_exists($attachment)) {
        // Generar un separador único
        $boundary = md5(time());
        
        // Cabeceras para correo con adjunto
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        
        // Cuerpo del mensaje multipart
        $message_body = "--$boundary\r\n";
        $message_body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $message_body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $message_body .= $email_body . "\r\n";
        
        // Adjuntar la imagen
        $file_content = file_get_contents($attachment);
        $message_body .= "--$boundary\r\n";
        $message_body .= "Content-Type: application/octet-stream; name=\"$attachment_filename\"\r\n";
        $message_body .= "Content-Transfer-Encoding: base64\r\n";
        $message_body .= "Content-Disposition: attachment; filename=\"$attachment_filename\"\r\n\r\n";
        $message_body .= chunk_split(base64_encode($file_content)) . "\r\n";
        $message_body .= "--$boundary--";
        
        // Enviar correo con adjunto
        $mail_sent = mail($recipient_email, $email_subject, $message_body, $headers);
    } else {
        // Enviar correo normal sin adjunto
        $mail_sent = mail($recipient_email, $email_subject, $email_body, $headers);
    }
    
    // Verificar si el correo se envió correctamente
    if ($mail_sent) {
        $response['status'] = 'success';
        $response['message'] = 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.';
    } else {
        $response['message'] = 'Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
    }
}

// Devolver respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
