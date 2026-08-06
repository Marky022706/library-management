<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $availableCopies = $this->copies ? $this->copies->where('availability_status', 'Available')->count() : 0;
        $totalCopies = $this->copies ? $this->copies->count() : 0;

        return [
            'book_id' => $this->book_id,
            'title' => $this->title,
            'description' => $this->description,
            'publication_year' => $this->publication_year,
            'cover_image_url' => $this->cover_image_url,
            'cataloging_source' => $this->cataloging_source,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'publisher' => new PublisherResource($this->whenLoaded('publisher')),
            'authors' => AuthorResource::collection($this->whenLoaded('authors')),
            'copies' => BookCopyResource::collection($this->whenLoaded('copies')),
            'available_copies_count' => $availableCopies,
            'total_copies_count' => $totalCopies,
            'has_digital_edition' => $this->digitalBooks ? $this->digitalBooks->count() > 0 : false,
            'created_at' => $this->created_at,
        ];
    }
}
