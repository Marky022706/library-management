<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShelfLocationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'shelf_location_id' => $this->shelf_location_id,
            'location_code' => $this->location_code,
        ];
    }
}
