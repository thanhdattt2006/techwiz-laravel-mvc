<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\View\View;

class DemoController extends Controller
{
    /**
     * Render the demo view.
     */
    public function index(): View
    {
        return view('demo');
    }
}
