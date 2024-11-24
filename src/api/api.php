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
                    'patient_id' => $results['patient_id'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'gender' => $results['gender']
                );
            }
            return json_encode($users);
        }             
    }
    return $API = new API;
?>
