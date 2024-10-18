<?php

use Illuminate\Support\Str;

if (!function_exists('integerToRoman')) {
    function integerToRoman($integer) {
        $map = [
            'M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400, 'C' => 100, 'XC' => 90, 'L' => 50,
            'XL' => 40, 'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1
        ];
        $roman = '';
        while ($integer > 0) {
            foreach ($map as $rom => $int) {
                if ($integer >= $int) {
                    $integer -= $int;
                    $roman .= $rom;
                    break;
                }
            }
        }
        return $roman;
    }
}

if(!function_exists('generateInvoiceNumber')) {
    function generateInvoiceNumber($prefix = 'IVR', $sequenceNumber, $monthNumber) {
        // 1. Prefix tetap (IVR)
        $invoicePrefix = $prefix;
    
        // 2. Tanggal dalam format YYYYMMDD
        $date = date('Ymd');
    
        // 3. Angka Romawi dari nomor urut
        $romanSequence = integerToRoman($sequenceNumber);
    
        // 4. Angka Romawi dari bulan
        $romanMonth = integerToRoman($monthNumber);

        // buatkan angka unik
        $uniqueNumber = strtoupper(Str::random(8));
    
        // Gabungkan semuanya dengan format yang diinginkan
        return "{$invoicePrefix}/{$date}/{$romanSequence}/{$romanMonth}/{$uniqueNumber}";
    }
}