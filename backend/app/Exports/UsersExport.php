<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class UsersExport implements FromView, WithStyles, WithEvents
{

    public function view() : View
    {
        $users = User::ofRole('user')->get();
        return view('exports.users', compact('users'));
    }

    public function styles(Worksheet $sheet)
    {
        $last_row = $sheet->getHighestRow();
        // Apply border to all table areas
        $sheet->getStyle("A1:E$last_row")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
        ]);

        // Adding styling to header
        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ],
        ]);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestColumn = $sheet->getHighestColumn();
                $highestColumnIndex = Coordinate::columnIndexFromString($highestColumn);

                //set auto size for all columns
                for($col = 1; $col <= $highestColumnIndex; $col++){
                    $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
                }
            },
        ];
    }
}
