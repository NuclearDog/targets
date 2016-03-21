<?php

class Request
{
	const OP_CREATE = 'create';
	const OP_READ = 'read';
	const OP_UPDATE = 'update';
	const OP_DESTROY = 'destroy';

	protected $_object, $_instance, $_operation, $_data;

	public function getObject()
	{
		return $this->_object;
	}

	public function getInstance()
	{
		return $this->_instance;
	}

	public function getOperation()
	{
		return $this->_operation;
	}

	public function getData()
	{
		return $this->_data;
	}

	public function hasInstance()
	{
		return isset($this->_instance);
	}

	public static function create()
	{
		$request = new Request();

		$request_uri = $_SERVER['REQUEST_URI'];
		$request_uri = explode('?', $request_uri)[0];
		$method = isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']) ? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] : $_SERVER['REQUEST_METHOD'];

		$base_uri = dirname($_SERVER['DOCUMENT_URI']);
		$request_uri = substr($request_uri, strlen($base_uri));

		$uri = explode('/', substr($request_uri, 1));

		if (sizeof($uri) == 0 || empty($uri[0]) || sizeof($uri) > 2)
			return false;

		$request->_object = $uri[0];
		if (sizeof($uri) == 2)
			$request->_instance = $uri[1];

		switch ($method)
		{
			case 'GET':
				$request->_operation = static::OP_READ;
				$request->_data = (object)$_GET;
				break;
			case 'POST':
				$request->_operation = static::OP_CREATE;
				$request->_data  = (object)$_POST;
				break;
			case 'PUT':
			case 'DELETE':
				$request->_operation = $method == 'PUT' ? static::OP_UPDATE : static::OP_DESTROY;
				$requestBody = file_get_contents('php://input');
				parse_str($requestBody, $requestVars);
				$request->_data = (object)$requestVars;
				break;
		}

		if ($request->_operation == static::OP_CREATE && isset($request->_instance))
			return false;

		return $request;
		
	}
	
	public function __toString()
	{
		$str = $this->_operation.' '.$this->_object.(isset($this->_instance) ? '#'.$this->_instance : '').PHP_EOL;
		foreach ($this->_data as $k=>$v)
			$str .= $k.'='.$v.PHP_EOL;
		return $str;
	}

}

?>