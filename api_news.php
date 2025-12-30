<?php
/**
 * Gubicoo News API Endpoint
 * Returns news data in JSON format for the frontend
 * 
 * Usage: GET /api/news.php?country=Canada&category=Draw&limit=20
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration
$db_config = [
    'host' => 'localhost',
    'user' => 'root',
    'password' => 'your_password_here',
    'database' => 'gubicoo'
];

try {
    // Connect to database
    $conn = new mysqli(
        $db_config['host'],
        $db_config['user'],
        $db_config['password'],
        $db_config['database']
    );
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Get query parameters
    $country = isset($_GET['country']) ? $_GET['country'] : null;
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Build query
    $query = "SELECT * FROM news WHERE 1=1";
    $params = [];
    $types = "";
    
    if ($country && $country !== 'all') {
        $query .= " AND country = ?";
        $params[] = $country;
        $types .= "s";
    }
    
    if ($category && $category !== 'all') {
        $query .= " AND category = ?";
        $params[] = $category;
        $types .= "s";
    }
    
    $query .= " ORDER BY published_date DESC, created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";
    
    // Prepare and execute
    $stmt = $conn->prepare($query);
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Fetch news
    $news = [];
    while ($row = $result->fetch_assoc()) {
        $news[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'summary' => $row['summary'],
            'country' => $row['country'],
            'category' => $row['category'],
            'source_name' => $row['source_name'],
            'source_url' => $row['source_url'],
            'published_date' => $row['published_date'],
            'full_content' => $row['summary'] // Can be expanded if you add a full_content column
        ];
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM news WHERE 1=1";
    if ($country && $country !== 'all') {
        $countQuery .= " AND country = '" . $conn->real_escape_string($country) . "'";
    }
    if ($category && $category !== 'all') {
        $countQuery .= " AND category = '" . $conn->real_escape_string($category) . "'";
    }
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    
    // Return JSON response
    echo json_encode([
        'success' => true,
        'data' => $news,
        'total' => (int)$total,
        'limit' => $limit,
        'offset' => $offset
    ], JSON_PRETTY_PRINT);
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>




