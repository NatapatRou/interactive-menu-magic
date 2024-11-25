<?php
    require_once __DIR__ . '/config.php';
    class API {
        function select_patience():bool {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("SELECT * FROM Patient");
            $data->execute();
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                $users[] = array(
                    'id' => $results['id'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'gender' => $results['gender'],
                    'email' => $results['email'],
                    'password' => $results['password'],
                );
            }
            return json_encode($users);
        }             

        function select_doctor():bool {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("SELECT * FROM Doctor");
            $data->execute();
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                $users[] = array(
                    'id' => $results['id'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'gender' => $results['gender'],
                    'email' => $results['email'],
                    'password' => $results['password'],
                );
            }
            return json_encode($users);
        }

        function select_phramacist():bool {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("SELECT * FROM Pharmacist");
            $data->execute();
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                $users[] = array(
                    'id' => $results['id'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'gender' => $results['gender'],
                    'email' => $results['email'],
                    'password' => $results['password'],
                );
            }
            return json_encode($users);
        }

        function select_all_user():array {
            $db = new Connect;
            $users = array();
        // Use this if don't have role column in schema
            $data = $db->prepare("SELECT id, 'Patient' AS role, fname, lname, email, password FROM Patient
    UNION ALL
    SELECT id, 'Doctor' AS role, fname, lname, email, password FROM Doctor
    UNION ALL
    SELECT id, 'Pharmacist' AS role, fname, lname, email, password FROM Pharmacist");
        // Use this if have role column in schema
    //         $data = $db->prepare("SELECT role, fname, lname, email, password FROM Patient
    // UNION ALL
    // SELECT role, fname, lname, email, password FROM Doctor
    // UNION ALL
    // SELECT role, fname, lname, email, password FROM Pharmacist");
            $data->execute();
        // The fetch() method is called on a PDO statement object (e.g., $data in your example) after executing a query. It retrieves the next row from the result set.
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                $users[] = array(
                    'id' => $results['id'],
                    'role' => $results['role'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'email' => $results['email'],
                    'password' => $results['password'],
                );
            }
            return $users;
        }

        function select_all_available(): array {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("id, fname, lname, status FROM Doctor WHERE status = 'Available'
    UNION ALL
    SELECT id, fname, lname, status FROM Pharmacist WHERE status = 'Available'");
            $data->execute();
        // The fetch() method is called on a PDO statement object (e.g., $data in your example) after executing a query. It retrieves the next row from the result set.
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                # use like dict -> "id": f"{result['id]}" | key:value
                $users[] = array(
                    'id' => $results['id'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'status' => $results['status'],
                );
            }
            return $users;
        }

        function select_first_available(): array {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("(SELECT id, fname, lname, status FROM Doctor WHERE status = 'Available' LIMIT 1) UNION ALL (SELECT id, fname, lname, status FROM Pharmacist WHERE status = 'Available' LIMIT 1);");
            $data->execute();
        // The fetch() method is called on a PDO statement object (e.g., $data in your example) after executing a query. It retrieves the next row from the result set.
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                # use like dict -> "id": f"{result['id]}" | key:value
                $users[] = array(
                    'id' => $results['id'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'status' => $results['status'],
                );
            }
            return $users;
        }
        
    }
    return $API = new API;
?>
