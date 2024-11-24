<?php
    class Connect extends PDO {
        public function __construct()
        {
            parent::__construct("mysql:host=localhost;dbname=drug_dispense", "root", "root");
            array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES usf8");
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
    }
?>
