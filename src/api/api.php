<?php
    require_once __DIR__ . '/config.php';
    class API {
        function select_patience() {
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

        function select_doctor() {
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

        function select_phramacist() {
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

        function select_all_user() {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("SELECT 'Patient' AS role, fname, lname, email, password FROM Patient
    UNION ALL
    SELECT 'Doctor' AS role, fname, lname, email, password FROM Doctor
    UNION ALL
    SELECT 'Pharmacist' AS role, fname, lname, email, password FROM Pharmacist");
            $data->execute();
        // The fetch() method is called on a PDO statement object (e.g., $data in your example) after executing a query. It retrieves the next row from the result set.
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                $users[] = array(
                    'role' => $results['role'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'email' => $results['email'],
                    'password' => $results['password'],
                );
            }
            return $users;
        }
        
    }
    return $API = new API;
?>
