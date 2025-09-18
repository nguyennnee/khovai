<?php
// Response utilities

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function sendSuccess($message = 'Success', $data = null, $statusCode = 200) {
    $response = [
        'success' => true,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    sendResponse($response, $statusCode);
}

function sendError($message = 'Error', $statusCode = 400, $errors = null) {
    $response = [
        'success' => false,
        'message' => $message
    ];
    
    if ($errors !== null) {
        $response['errors'] = $errors;
    }
    
    sendResponse($response, $statusCode);
}

function sendValidationError($errors) {
    sendError('Validation failed', 422, $errors);
}

function sendUnauthorized($message = 'Unauthorized') {
    sendError($message, 401);
}

function sendForbidden($message = 'Forbidden') {
    sendError($message, 403);
}

function sendNotFound($message = 'Not found') {
    sendError($message, 404);
}

function sendMethodNotAllowed($message = 'Method not allowed') {
    sendError($message, 405);
}

function sendInternalError($message = 'Internal server error') {
    sendError($message, 500);
}

// Helper function to get request body
function getRequestBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

// Helper function to get query parameters
function getQueryParams() {
    return $_GET;
}

// Helper function to get pagination parameters
function getPaginationParams() {
    $page = max(1, intval($_GET['page'] ?? 1));
    $perPage = min(MAX_PAGE_SIZE, max(1, intval($_GET['per_page'] ?? DEFAULT_PAGE_SIZE)));
    $skip = ($page - 1) * $perPage;
    
    return [
        'page' => $page,
        'per_page' => $perPage,
        'skip' => $skip
    ];
}

// Helper function to format pagination response
function formatPaginationResponse($data, $total, $page, $perPage) {
    return [
        'data' => $data,
        'total' => $total,
        'page' => $page,
        'per_page' => $perPage,
        'pages' => ceil($total / $perPage)
    ];
}
?>
