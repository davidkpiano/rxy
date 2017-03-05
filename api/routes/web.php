<?php

use Illuminate\Http\Response;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->version();
});

$app->get('song/{id}', function ($songId) {
    $data = app('db')->select("SELECT * FROM songs WHERE id = :id", ['id' => $songId]);

    return response()->json($data);
});

$app->post('song', function (Illuminate\HTTP\Request $request) {
    $name = $request->json()->get('name');
    $data = json_encode($request->json()->get('data'));    
    app('db')->insert('insert into songs (name, data) values (?, ?)', [$name, $data]);
});
