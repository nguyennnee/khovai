<?php
// Validation utilities

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePassword($password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/', $password);
}

function validatePhone($phone) {
    // Vietnamese phone number format
    return preg_match('/^(\+84|0)[0-9]{9,10}$/', $phone);
}

function validateRequired($value, $fieldName) {
    if (empty($value)) {
        return "$fieldName is required";
    }
    return null;
}

function validateString($value, $fieldName, $minLength = 1, $maxLength = 255) {
    if (!is_string($value)) {
        return "$fieldName must be a string";
    }
    
    $length = strlen($value);
    if ($length < $minLength) {
        return "$fieldName must be at least $minLength characters";
    }
    
    if ($length > $maxLength) {
        return "$fieldName must be no more than $maxLength characters";
    }
    
    return null;
}

function validateNumber($value, $fieldName, $min = null, $max = null) {
    if (!is_numeric($value)) {
        return "$fieldName must be a number";
    }
    
    $num = floatval($value);
    
    if ($min !== null && $num < $min) {
        return "$fieldName must be at least $min";
    }
    
    if ($max !== null && $num > $max) {
        return "$fieldName must be no more than $max";
    }
    
    return null;
}

function validateInteger($value, $fieldName, $min = null, $max = null) {
    if (!is_numeric($value) || intval($value) != $value) {
        return "$fieldName must be an integer";
    }
    
    $num = intval($value);
    
    if ($min !== null && $num < $min) {
        return "$fieldName must be at least $min";
    }
    
    if ($max !== null && $num > $max) {
        return "$fieldName must be no more than $max";
    }
    
    return null;
}

function validateArray($value, $fieldName) {
    if (!is_array($value)) {
        return "$fieldName must be an array";
    }
    return null;
}

function validateInArray($value, $fieldName, $allowedValues) {
    if (!in_array($value, $allowedValues)) {
        return "$fieldName must be one of: " . implode(', ', $allowedValues);
    }
    return null;
}

function validateFile($file, $fieldName, $allowedTypes = null, $maxSize = null) {
    if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
        return "$fieldName upload failed";
    }
    
    if ($maxSize && $file['size'] > $maxSize) {
        return "$fieldName file size too large";
    }
    
    if ($allowedTypes) {
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedTypes)) {
            return "$fieldName file type not allowed";
        }
    }
    
    return null;
}

function validateData($data, $rules) {
    $errors = [];
    
    foreach ($rules as $field => $fieldRules) {
        $value = $data[$field] ?? null;
        
        foreach ($fieldRules as $rule) {
            $error = null;
            
            if (is_string($rule)) {
                switch ($rule) {
                    case 'required':
                        $error = validateRequired($value, $field);
                        break;
                    case 'email':
                        if ($value && !validateEmail($value)) {
                            $error = "$field must be a valid email";
                        }
                        break;
                    case 'password':
                        if ($value && !validatePassword($value)) {
                            $error = "$field must be at least 8 characters with uppercase, lowercase, and number";
                        }
                        break;
                    case 'phone':
                        if ($value && !validatePhone($value)) {
                            $error = "$field must be a valid Vietnamese phone number";
                        }
                        break;
                }
            } elseif (is_array($rule)) {
                $ruleType = $rule[0];
                $params = array_slice($rule, 1);
                
                switch ($ruleType) {
                    case 'string':
                        $error = validateString($value, $field, ...$params);
                        break;
                    case 'number':
                        $error = validateNumber($value, $field, ...$params);
                        break;
                    case 'integer':
                        $error = validateInteger($value, $field, ...$params);
                        break;
                    case 'array':
                        $error = validateArray($value, $field);
                        break;
                    case 'in':
                        $error = validateInArray($value, $field, $params[0]);
                        break;
                }
            }
            
            if ($error) {
                $errors[$field] = $error;
                break; // Stop at first error for this field
            }
        }
    }
    
    return $errors;
}
?>
