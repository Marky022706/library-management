<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,category_id',
            'publisher_id' => 'nullable|exists:publishers,publisher_id',
            'publication_year' => 'nullable|integer|min:1|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'cover_image_url' => 'nullable|string|max:255',
            'cataloging_source' => 'nullable|in:AI,Manual',
            'author_ids' => 'required|array|min:1',
            'author_ids.*' => 'exists:authors,author_id',
            'initial_copies' => 'nullable|integer|min:1|max:20',
            'shelf_location_id' => 'required_with:initial_copies|nullable|exists:shelf_locations,shelf_location_id',
        ];
    }
}
