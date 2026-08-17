<?php
file_put_contents('php://stdout', "RAW=" . file_get_contents('php://input') . "\n");
