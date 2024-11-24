<?php
    require_once __DIR__ . '/config.php';
    class API {
        function Select() {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("SELECT * FROM patient");
            $data->execute();
            while($results = $data->fetch(PDO::FETCH_ASSOC)){
                $users[] = array(
                    'patient_id' => $results['id'],
                    'fname' => $results['fname'],
                    'lname' => $results['lname'],
                    'gender' => $results['gender']
                );
            }
            return json_encode($users);
        }             
    }
    $API = new API;
    header("Content-Type: application/json");
    echo $API->Select();
?>
