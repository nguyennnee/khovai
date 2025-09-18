<?php
// JWT implementation

class JWT {
    public static function encode($payload, $key, $alg = 'HS256') {
        $header = json_encode(['typ' => 'JWT', 'alg' => $alg]);
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $key, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    public static function decode($jwt, $key, $allowed_algs = ['HS256']) {
        $tks = explode('.', $jwt);
        if (count($tks) != 3) {
            throw new Exception('Wrong number of segments');
        }
        
        list($headb64, $bodyb64, $cryptob64) = $tks;
        
        if (null === ($header = self::jsonDecode(self::urlsafeB64Decode($headb64)))) {
            throw new Exception('Invalid header encoding');
        }
        
        if (null === $payload = self::jsonDecode(self::urlsafeB64Decode($bodyb64))) {
            throw new Exception('Invalid claims encoding');
        }
        
        if (false === ($sig = self::urlsafeB64Decode($cryptob64))) {
            throw new Exception('Invalid signature encoding');
        }
        
        if (empty($header->alg)) {
            throw new Exception('Empty algorithm');
        }
        
        if (!in_array($header->alg, $allowed_algs)) {
            throw new Exception('Algorithm not allowed');
        }
        
        if ($header->alg === 'HS256') {
            $expected = hash_hmac('sha256', $headb64 . "." . $bodyb64, $key, true);
            if (!hash_equals($sig, $expected)) {
                throw new Exception('Signature verification failed');
            }
        }
        
        return $payload;
    }
    
    private static function jsonDecode($input) {
        $obj = json_decode($input);
        if (function_exists('json_last_error') && $errno = json_last_error()) {
            self::handleJsonError($errno);
        } elseif ($obj === null && $input !== 'null') {
            throw new Exception('Null result with non-null input');
        }
        return $obj;
    }
    
    private static function urlsafeB64Decode($input) {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $input .= str_repeat('=', $padlen);
        }
        return base64_decode(strtr($input, '-_', '+/'));
    }
    
    private static function handleJsonError($errno) {
        $messages = [
            JSON_ERROR_DEPTH => 'Maximum stack depth exceeded',
            JSON_ERROR_CTRL_CHAR => 'Unexpected control character found',
            JSON_ERROR_SYNTAX => 'Syntax error, malformed JSON'
        ];
        throw new Exception(
            isset($messages[$errno])
            ? $messages[$errno]
            : 'Unknown JSON error: ' . $errno
        );
    }
}
?>
