<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookCopyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'copy_id' => $this->copy_id,
            'book_id' => $this->book_id,
            'shelf_location_id' => $this->shelf_location_id,
            'shelf_location' => new ShelfLocationResource($this->whenLoaded('shelfLocation')),
            'accession_number' => $this->accession_number,
            'qr_code_value' => $this->qr_code_value,
            'availability_status' => $this->availability_status,
            'condition_status' => $this->condition_status,
            'acquisition_date' => $this->acquisition_date,
        ];
    }
}
