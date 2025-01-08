<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class OrderItemsSheet implements FromView, WithStyles, WithEvents, WithTitle
{
    protected $orderItems;
    protected $option;

    public function __construct($orderItems, $option)
    {
        $this->orderItems = $orderItems;
        $this->option = $option;
    }

    public function view(): View
    {
        return view('exports.order_items', ['orderItems' => $this->orderItems]);
    }

    public function styles(Worksheet $sheet)
    {
        $last_row = $sheet->getHighestRow();
        // Apply border to all table areas
        $sheet->getStyle("A1:F$last_row")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
        ]);

        // Adding styling to header
        $sheet->getStyle('A1:F1')->applyFromArray([
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

    public function title(): string
    {
        return "Order Items - $this->option";
    }
}
