<?php

class Response implements \JsonSerializable
{
	const STATUS_SUCCESS = 'success';
	const STATUS_FAIL = 'fail';
	const STATUS_ERROR = 'error';

	protected $_code = '200', $_status = 'success', $_message = 'OK', $_data;

	public function setData($data)
	{
		$this->_data = $data;
	}

	public function setStatusError()
	{
		$this->_status = 'error';
	}

	public function setStatusFail()
	{
		$this->_status = 'fail';
	}

	public function setStatusSuccess()
	{
		$this->_status = 'success';
	}

	public function setCode($code)
	{
		$this->_code = $code;

		switch ($code)
		{
			case '200':
				$this->_status = static::STATUS_SUCCESS;
				$this->_message = 'OK';
				break;
			case '400':
				$this->_status = static::STATUS_FAIL;
				$this->_message = 'Bad Request';
				break;
			case '403':
				$this->_status = static::STATUS_FAIL;
				$this->_message = 'Forbidden';
				break;
			case '404':
				$this->_status = static::STATUS_FAIL;
				$this->_message = 'Not Found';
				break;
			case '405':
				$this->_status = static::STATUS_FAIL;
				$this->_message = 'Method Not Allowed';
			case '500':
				$this->_status = static::STATUS_ERROR;
				$this->_message = 'Internal Server Error';
				break;
		}
	}

	public function setMessage($message)
	{
		$this->_message = $message;
	}

	public function jsonSerialize()
	{
		$response = [];
		$response['code'] = $this->_code;
		$response['status'] = $this->_status;
		if ($response['status'] == static::STATUS_SUCCESS && isset($this->_data))
			$response['data'] = $this->_data;
		else
			$response['message'] = $this->_message;
		return $response;
	}

	public function exportHeaders()
	{
		header($_SERVER['SERVER_PROTOCOL'].' '.$this->_code.' '.$this->_message);
		header('Content-Type: application/json; charset=UTF-8');
	}

	public static function error($code, $message=null)
	{
		$response = new Response();
		$response->setCode($code);
		if (isset($message))
			$response->setMessage($message);
		$response->exportHeaders();
		echo json_encode($response);
		die();
	}

	public function output()
	{
		$this->exportHeaders();
		echo json_encode($this);
	}
}

?>